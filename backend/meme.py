d = {'a': [3,4,5],
    'b':[3,5],
    'c':[100],
    'd':[69,1,2,3,4]}
for i in sorted(d, key=lambda k: len(d[k]), reverse=True):
    print(i)    
