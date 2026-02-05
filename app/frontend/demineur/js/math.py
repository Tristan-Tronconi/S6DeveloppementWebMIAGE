list = [i for i in range(1,26)]
for j in range(1,len(list)):
    txt = ""
    for i in list:
        if i%j==0:
            txt+= str(i)+","
    print(txt[:-1])