# Signup

## Mutation

```
mutation Signup($auth: SignupInput!){
  signup(input: $auth){
    token
    user {
      id
    }
  }
}
```

## Query Variables

```
{
  "auth": {
    "email": "brito@email.com",
    "password": "qwioeuqiowueooq",
    "role": "ADMIN"
  }
}
```
