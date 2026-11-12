"""Build a ready-to-install zip without any extra dependency."""
from pathlib import Path
import json, struct, zlib, zipfile

root=Path(__file__).resolve().parents[1]
icons=root/'extension/icons';icons.mkdir(parents=True,exist_ok=True)
for size in [16,48,128]:
    rows=[]
    grid=["0000000000000000","0000000110000000","0000001111000000","0000001111000000","0000011111100000","0111111111111110","0011111111111100","0001111111111000","0001110110111000","0001110110111000","0011111111111100","0011111111111100","0011110000111100","0011100000011100","0000000000000000","0000000000000000"]
    for y in range(size):
        row=bytearray()
        for x in range(size):
            on=grid[min(15,y*16//size)][min(15,x*16//size)]=='1'
            row.extend((124,234,245,255) if on else (16,22,49,255))
        rows.append(b'\x00'+row)
    def chunk(k,v):return struct.pack('!I',len(v))+k+v+struct.pack('!I',zlib.crc32(k+v)&0xffffffff)
    data=b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('!2I5B',size,size,8,6,0,0,0))+chunk(b'IDAT',zlib.compress(b''.join(rows)))+chunk(b'IEND',b'')
    (icons/f'icon-{size}.png').write_bytes(data)
target=root/'downloads/themeai-pixel-studio.zip'
target.parent.mkdir(parents=True,exist_ok=True)
with zipfile.ZipFile(target,'w',zipfile.ZIP_DEFLATED) as archive:
    for file in sorted((root/'extension').rglob('*')):
        if file.is_file():archive.write(file,'themeai-pixel-studio/'+str(file.relative_to(root)))
    for file in ['themeai.user.js','HUONG-DAN.md']:
        if(root/file).is_file():archive.write(root/file,'themeai-pixel-studio/'+file)
print(f'Packaged {target.name}: {target.stat().st_size:,} bytes')
