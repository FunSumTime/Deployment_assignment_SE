# Resource
**Boxing**
Atributes:
- id (Primary key integer)
- first_name (string)
- last_name (string)
- wins (integer)
- losses (integer)
- gold (integer)

# Schema
```md

```sql
CREATE TABLE boxers (
  id INTEGER PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  wins INTEGER,
  losses INTEGER,
  gold INTEGER
);

```
# REST End Points

| Name |  Method |  Path |
|-----------|-----------|-----------|
|  Retreve Boxer Collection   |  GET   |  /boxers   |
| Create A Boxer  | POST   | /boxers   |
| Update A Boxer  | PUT   | /boxers/\<id>   |
| Delete A Boxer  | DELETE   | /boxers/\<id>   |


# How to build and push the Docker images
**Front end**
-docker build -t boxers-frontend ./client
-docker tag boxers-frontend theisenkassens/boxers-frontend:latest
-docker push theisenkassens/boxers-frontend:latest

**Back end**
-docker build -t boxers-backend .
-docker tag boxers-backend theisenkassens/boxers-backend:latest
-docker push theisenkassens/boxers-backend:latest



