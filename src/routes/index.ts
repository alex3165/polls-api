import * as express from 'express';
import { DB, Poll, Answer, answersSchema, pollSchema } from '../db';
import * as uuid from 'node-uuid';
import * as Joi from 'joi';
import * as Marked from 'marked';
import * as fs from 'fs';
import { emit } from '../pollEmitter';

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

const getAnswer = (a: Answer) => ({
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

const db = new DB();

const setup = () => {
  return express.Router()
    .get('/', (req, res) => {
      res.status(200).send(indexEndpointContent);
    })
    .get('/reset', (req, res) => {
      res.status(200).send(db.reset().get());
    })
    .get('/polls', (req, res) => {
      res.status(200).send(db.get());
    })
    .get('/poll', (req, res) => {
      const poll: Poll = db.getPoll(req.query.pollId);

      if (poll) {
        res.status(200).send(poll);
      } else {
        res.status(404).send(error('No poll found with the id: ' + req.query.pollId));
      }
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
        const result = db.setPoll(key, {
          id: key,
          ...poll,
          answer: poll.answer ? poll.answer.map(getAnswer) : []
        });

        res.status(200).send(result);
      });
    })
    .post('/poll/answers', (req, res) => {
      // Check pollId
      if (!db.getPoll(req.body.pollId)) {
        res.status(404).send(error('Poll id does not exists'));
        return;
      }

      // Check answersSchema
      Joi.validate(req.body.answers, answersSchema, (err, value) => {
        if (err) {
          res.status(404).send(error(err.message));
          return;
        }
        const answers: Answer[] = req.body.answers.map(getAnswer)

        const poll = db.getPoll(req.body.pollId);
        poll.answer.push(...answers);
        res.status(200).send(poll);
      });
    })
    .post('/poll/vote', (req, res) => {
      if (!db.getPoll(req.body.pollId)) {
        console.error('Request body: ', req.body);
        res.status(404).send(error('Poll id does not exists'));
        return;
      }

      const poll: Poll = db.getPoll(req.body.pollId);
      const answer = poll.answer.find((a) => a.id === req.body.answerId);

      if (!answer) {
        res.status(404).send(error('answerId does not exists'));
      } else {
        answer.votes += 1;
        res.status(201).send(poll);
        emit(poll);
      }
    });
};

export default setup;
