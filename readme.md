# Node-express-ts

Simple boilerplate to setup nodejs express with typescript

# API

## GET /polls

Get all the polls, the answers and the votes.

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

Create a new Poll, can be initialised it with some default answer

Request
```
{
  "title": "Poll title",
  "answer": [{
    "answer": "Answer title"
  }]
}
```

Response
```
{
  "id": "pollId",
  "title": "pollTitle",
  "answer": [{
    "id": "answerId",
    "answer": "The answer text",
    "votes": 1
  }]
}
```

## POST /polls/:pollId

Add an answer the poll (pollId)

Request
```
[
  {
    "answer": "The answer text"
  }
]
```

Response
```
{
  "id": "pollId",
  "title": "pollTitle",
  "answer": [{
    "id": "answerId",
    "answer": "The answer text",
    "votes": 1
  }]
}
```

## POST /polls/:pollId/answer/:answerId

Add a vote to the poll (pollId) and to the answer (answerId)

Response
```
{
  "id": "pollId",
  "title": "pollTitle",
  "answer": [{
    "id": "answerId",
    "answer": "The answer text",
    "votes": 1
  }]
}
```
