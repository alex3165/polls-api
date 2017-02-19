# Polls API

Simple API to create polls and vote

# Websocket endpoint

## ws://api.alexrieux.fr
```
wsc http://api.alexrieux.fr
```

Return a poll object everytime someone vote on any poll

Message
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

## GET /reset

Reset the polls to their initial state

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

## GET /poll?pollId=pollId

Get the poll for the given id

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

## POST /poll/answers

Add an answer the poll (pollId)

Request
```
{
  "pollId": "pollId",
  "answers": [
    {
      "answer": "The answer text"
    }
  ]
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

## POST /poll/vote

Add a vote to the poll (pollId) and to the answer (answerId)

Request
```
{
  "pollId": "pollId",
  "answerId": "answerId"
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
