import io, json, os, unittest, zipfile
from storage import encrypt, decrypt, BLOCK, LIMIT
from cryptography.exceptions import InvalidTag

class StorageTests(unittest.TestCase):
    password='Lab-demo-password-2026'
    def test_round_trip_boundaries(self):
        for n in (0,1,BLOCK-1,BLOCK,BLOCK+1,200000,LIMIT):
            with self.subTest(size=n):
                data=os.urandom(n); archive,m=encrypt(data,'sample.bin',self.password)
                recovered,_=decrypt(archive,self.password)
                self.assertEqual(data,recovered)
                self.assertEqual(m['count'], max(1,(n+BLOCK-1)//BLOCK))
    def test_wrong_password(self):
        a,_=encrypt(b'hello','file',self.password)
        with self.assertRaises(InvalidTag): decrypt(a,'Wrong-password-123')
    def mutate(self, entry, change):
        a,_=encrypt(b'x'*(BLOCK+1),'file',self.password); out=io.BytesIO()
        with zipfile.ZipFile(io.BytesIO(a)) as src, zipfile.ZipFile(out,'w') as dst:
            for name in src.namelist():
                data=src.read(name)
                if name==entry: data=change(data)
                dst.writestr(name,data)
        return out.getvalue()
    def test_modified_ciphertext(self):
        a=self.mutate('blocks/000000.enc',lambda b:b[:-1]+bytes([b[-1]^1]))
        with self.assertRaises(InvalidTag): decrypt(a,self.password)
    def test_modified_manifest(self):
        a=self.mutate('manifest.json',lambda b:b.replace(b'file',b'evil'))
        with self.assertRaises(InvalidTag): decrypt(a,self.password)
    def test_missing_block(self):
        a,_=encrypt(b'x'*(BLOCK+1),'file',self.password); out=io.BytesIO()
        with zipfile.ZipFile(io.BytesIO(a)) as src, zipfile.ZipFile(out,'w') as dst:
            for name in src.namelist():
                if name!='blocks/000001.enc':dst.writestr(name,src.read(name))
        with self.assertRaises(ValueError):decrypt(out.getvalue(),self.password)
    def test_unique_encryption(self):
        a,_=encrypt(b'hello','file',self.password);b,_=encrypt(b'hello','file',self.password)
        self.assertNotEqual(a,b)
    def test_short_password(self):
        with self.assertRaises(ValueError):encrypt(b'a','file','short')
    def test_oversize_rejected(self):
        with self.assertRaises(ValueError):encrypt(b'x'*(LIMIT+1),'file',self.password)

if __name__=='__main__':unittest.main(verbosity=2)
