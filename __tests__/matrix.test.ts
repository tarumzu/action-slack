import nock from 'nock';

process.env.GITHUB_RUN_ID = '2';
process.env.MATRIX_CONTEXT = '{"os": "ubuntu-18.04"}';

import { setupNockCommit, setupNockJobs, successMsg } from './helper';
import { Client, With, Success } from '../src/client';

beforeAll(() => {
  nock.disableNetConnect();
  setupNockCommit(process.env.GITHUB_SHA as string);
  setupNockJobs(
    process.env.GITHUB_RUN_ID as string,
    'actions.matrix-runs.jobs',
  );
});
afterAll(() => {
  nock.cleanAll();
  nock.enableNetConnect();
});

describe('MATRIX_CONTEXT', () => {
  beforeEach(() => {
    process.env.GITHUB_REPOSITORY = '8398a7/action-slack';
    process.env.GITHUB_EVENT_NAME = 'push';
    const github = require('@actions/github');
    github.context.payload = {};
  });

  it('runs in matrix', async () => {
    const withParams: With = {
      status: Success,
      mention: '',
      author_name: '',
      if_mention: '',
      username: '',
      icon_emoji: '',
      icon_url: '',
      channel: '',
      fields: 'job,took',
    };
    const client = new Client(withParams, process.env.GITHUB_TOKEN, '');
    expect(await client.prepare('')).toStrictEqual({
      text: successMsg,
      attachments: [
        {
          author_name: '',
          color: 'good',
          fields: [
            {
              short: true,
              title: 'job',
              value:
                '<https://github.com/8398a7/action-slack/runs/762195612|notification (ubuntu-18.04)>',
            },
            { short: true, title: 'took', value: '1 hour 1 min 1 sec' },
          ],
        },
      ],
      username: '',
      icon_emoji: '',
      icon_url: '',
      channel: '',
    });
  });
});
