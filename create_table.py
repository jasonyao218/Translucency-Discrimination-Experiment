import sqlite3
from itertools import combinations

conn = sqlite3.connect('file_list.db')

c = conn.cursor()

# c.execute("""CREATE TABLE files (
#             folder text,
#             obj1 text,
#             obj2 text,
#             selected integer
#             )""")

folders = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19']
objs = ['armadillo', 'buddha', 'bun', 'bunny', 'bust', 'cap', 'cube', 'dragon', 'lucy', 'star_smooth']
# combs = combinations(objs, 2)
# for comb in list(combs):
#     print(comb)
#     print(comb[0])
#     print(comb[1])

# print(folders)

for folder in folders:
    for comb in combinations(objs, 2):
        # print(folder)
        c.execute("INSERT INTO files VALUES ('%s', '%s', '%s', 0)" % (folder, comb[0], comb[1]))

# c.execute("DELETE FROM files")

conn.commit()

conn.close()

