import * as express from 'express';
import { Idb, Poll, Answer, answersSchema, pollSchema } from '../db';
import * as uuid from 'node-uuid';
import * as Joi from 'joi';
import * as Marked from 'marked';
import * as fs from 'fs';

const template = (data: string) => `
<link rel="stylesheet" href="https://sindresorhus.com/github-markdown-css/github-markdown.css">
<style>
.markdown-body {
  width: 800px;
  margin: 0px auto;
}
</style>
<article class="markdown-body">
${data}
</article>
`;

let indexEndpointContent = '';
fs.readFile('./readme.md', 'utf8', (err, data) => {
  if (err) throw err;

  indexEndpointContent =  template(Marked(data));
});

const getAnswer = (a:Answer) => ({
  id: uuid.v4(),
  ...a,
  votes: 0
});

const error = (message: string) => {
  console.error(message);

  return ({
    code: 404,
    error: message
  })
};

const setup = (db: Idb) => {
  return express.Router()
    .get('/', (req, res) => {
      res.status(200).send(indexEndpointContent);
    })
    .get('/polls', (req, res) => {
      res.status(200).send(db);
    })
    .post('/polls', (req, res) => {
      Joi.validate(req.body, pollSchema, (err, status) => {
        console.log(err, status);

        if (err) {
          res.status(404).send(error(err.message));
          return;
        }

        const poll: Poll = req.body;
        const key = uuid.v4();
        db[key] = {
          id: key,
          ...poll,
          answer: poll.answer ? poll.answer.map(getAnswer) : []
        };

        res.status(200).send(db[key]);
      });
    })
    .post('/polls/:pollId', (req, res) => {
      // Check pollId
      if (!db[req.params.pollId]) {
        res.status(404).send(error('Poll id does not exists'));
        return;
      }

      // Check answersSchema
      Joi.validate(req.body, answersSchema, (err, value) => {
        if (err) {
          res.status(404).send(error(err.message));
          return;
        }
        const answers: Answer[] = req.body.map(getAnswer)

        const poll = db[req.params.pollId];
        poll.answer.push(...answers);
        res.status(200).send(poll);
      });
    })
    .post('/polls/:pollId/answer/:answerId', (req, res) => {
      if (!db[req.params.pollId]) {
        res.status(404).send(error('Poll id does not exists'));
        return;
      }

      const poll: Poll = db[req.params.pollId];
      const answer = poll.answer.find((a) => a.id === req.params.answerId);

      if (!answer) {
        res.status(404).send(error('answerId does not exists'));
      } else {
        answer.votes += 1;
        res.status(201).send(poll);  
      }
    });
};

export default setup;
