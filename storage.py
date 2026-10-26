"""Password-encrypted block archive. Educational local prototype."""
import hashlib, io, json, os, zipfile
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes

BLOCK = 65536
LIMIT = 10 * 1024 * 1024
ITERATIONS = 600000

def derive(password, salt):
    if len(password) < 12:
        raise ValueError('Use a password with at least 12 characters.')
    return PBKDF2HMAC(algorithm=hashes.SHA256(), length=32, salt=salt,
                     iterations=ITERATIONS).derive(password.encode('utf-8'))

def encrypt(data, name, password):
    if len(data) > LIMIT:
        raise ValueError('File exceeds the 10 MiB limit.')
    salt = os.urandom(16)
    cipher = AESGCM(derive(password, salt))
    meta = dict(version=1, name=name, size=len(data), block_size=BLOCK,
                count=max(1, (len(data)+BLOCK-1)//BLOCK), salt=salt.hex(),
                iterations=ITERATIONS, sha256=hashlib.sha256(data).hexdigest())
    header = json.dumps(meta, sort_keys=True, separators=(',', ':')).encode()
    out = io.BytesIO()
    with zipfile.ZipFile(out, 'w', compression=zipfile.ZIP_STORED) as z:
        z.writestr('manifest.json', header)
        for i in range(meta['count']):
            nonce = os.urandom(12)
            aad = header + b':' + str(i).encode()
            z.writestr(f'blocks/{i:06d}.enc', nonce + cipher.encrypt(
                nonce, data[i*BLOCK:(i+1)*BLOCK], aad))
    return out.getvalue(), meta

def decrypt(archive, password):
    if len(archive) > LIMIT + 100000:
        raise ValueError('Archive exceeds limit.')
    with zipfile.ZipFile(io.BytesIO(archive)) as z:
        if len(z.infolist()) > 162 or any(x.file_size > LIMIT for x in z.infolist()):
            raise ValueError('Invalid archive dimensions.')
        header = z.read('manifest.json')
        m = json.loads(header)
        if (m['version'] != 1 or m['iterations'] != ITERATIONS or
            m['block_size'] != BLOCK or not 0 <= m['size'] <= LIMIT or
            m['count'] != max(1, (m['size']+BLOCK-1)//BLOCK)):
            raise ValueError('Invalid manifest.')
        expected = {'manifest.json'} | {f'blocks/{i:06d}.enc' for i in range(m['count'])}
        if set(z.namelist()) != expected or len(z.namelist()) != len(expected):
            raise ValueError('Missing or duplicate archive entries.')
        cipher = AESGCM(derive(password, bytes.fromhex(m['salt'])))
        blocks = []
        for i in range(m['count']):
            b = z.read(f'blocks/{i:06d}.enc')
            blocks.append(cipher.decrypt(b[:12], b[12:], header+b':'+str(i).encode()))
        data = b''.join(blocks)
        if len(data) != m['size'] or hashlib.sha256(data).hexdigest() != m['sha256']:
            raise ValueError('Integrity check failed.')
        return data, m
