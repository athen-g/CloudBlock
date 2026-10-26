"""Offline recovery, with password entered privately."""
import argparse, getpass
from pathlib import Path
from storage import decrypt

if __name__ == '__main__':
    p=argparse.ArgumentParser(description='Recover a CloudBlock archive offline')
    p.add_argument('archive',type=Path); p.add_argument('output',type=Path)
    args=p.parse_args()
    try:
        data,m=decrypt(args.archive.read_bytes(),getpass.getpass('Archive password: '))
        with args.output.open('xb') as f: f.write(data)
        print(f"Recovered {len(data)} bytes; SHA-256 verified: {m['sha256']}")
    except Exception as e:
        p.exit(1,f'Recovery failed ({type(e).__name__}). Check password, archive and output path.\n')
