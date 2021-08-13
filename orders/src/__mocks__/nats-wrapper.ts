

// fake out, duplicate functionality of real nats-wrapper.ts file

export const natsWrapper = {
  client: {
      publish: jest
          .fn()
          .mockImplementation(
              (subject: string, data: string, callback: () => void) => {
                  callback();
      })
  }  
};