# Node-express-ts

Simple boilerplate to setup nodejs express with typescript

# API

## GET /polls

Response
```
{
  "pollId": {
    "id": "pollId",
    "title": "pollTitle",
    "answer": [{
      "id": "answerId",
      "answer": "The answer text",
      "votes": 1
    }]
  }
}
```

## POST /polls
