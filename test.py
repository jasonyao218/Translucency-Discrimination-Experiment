import sqlite3
import random

conn = sqlite3.connect('file_list.db')
    # conn.set_trace_callback(print)
c = conn.cursor()
    # folders = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19']
li = c.execute('SELECT * FROM files WHERE selected=?',(0,)).fetchall()
    # for folder in folders:
    #     temp = c.execute('SELECT * FROM files WHERE selected=? AND folder=?',(0,folder)).fetchall()
    #     if(len(temp) != 0):
    #         li.append(temp)
random.shuffle(li)
    # trail_folder = li[0]
    # random.shuffle(trail_folder)
trail = li[:10]
print(trail)
for t in trail:
    c.execute('UPDATE files SET selected=? WHERE folder=? AND obj1=? AND obj2=?', (1, t[0], t[1], t[2]))
    conn.commit()
    # c.execute('UPDATE files SET selected=? WHERE folder=?', (0, '00'))
    # conn.commit()
conn.close()    