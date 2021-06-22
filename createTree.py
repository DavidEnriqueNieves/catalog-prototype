import mysql.connector
# Some other example server values are
# server = 'localhost\sqlexpress' # for a named instance
# server = 'myserver,port' # to specify an alternate port
database = 'prototype' 
username = 'debbido' 
password = 'debbido677357' 

table_name = database + "_table"

cnx  = mysql.connector.connect(
          host="localhost",
            user=username,
              passwd=password,
              database="prototype"
              )


cursor = cnx.cursor()

query = ("SELECT DISTINCT Genero FROM " + table_name)


cursor.execute(query)

root = {"name" : "root", "_children" : []}

for genero in cursor:
    print(genero)
    cursor2 = cnx.cursor(buffered=True)
    query = ("SELECT DISTINCT SubGenero FROM " + table_name + " WHERE Genero=\"" + genero[0] + "\"")
    cursor2.execute(query)

    generoArr=[]
    for subGenero in cursor2:
        subGenTree={"name":subGenero[0], "_children":[]}
        print(subGenero[0])
        cursor3 = cnx.cursor(buffered=True)
        query = ("SELECT DISTINCT Producto FROM " + table_name + " WHERE Genero=\"" + genero[0] + "\" AND SubGenero=\"" + subGenero[0]+ "\"")
        cursor3.execute(query)
        for prod in cursor3:
            subGenTree["_children"]+=prod
        cursor3.close()
        generoArr.append(subGenTree)
        print("SubGenTree is " + str(subGenTree))
    root["_children"].append(generoArr)
    cursor2.close()

print("Genero Arr")
print(generoArr)

print(root)
cursor.close()
cnx.close()
