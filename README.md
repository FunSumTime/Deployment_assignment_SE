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

-All from the Deployment_assignment_SE-main directory

**Front end**
-docker build -t theisenkassens/boxers-frontend ./client

-docker push theisenkassens/boxers-frontend

**Back end**

-docker build -t theisenkassens/boxers-backend .

-docker push theisenkassens/boxers-backend


# How to apply the Kubernetes files

- All from the k8s directory run:

**deployments**

-kubectl apply -f backend-deployment.yaml

-kubectl apply -f frontend-deployment.yaml

**ingress**

-kubectl apply -f ingress.yaml




