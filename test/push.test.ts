import { PushService } from '../src/service/PushService';

const pushService = new PushService();

describe('send push test', () => {
  it('sendPushSerivce test - 1', async (done) => {
    const result = await pushService.sendPushService();
    expect(result).toBeTruthy();
    done();
  });
});
