import { SerialPort } from 'serialport';

const path = '/dev/tty.usbserial-210';
const baudRate = 9600;

const serialport = new SerialPort({ path, baudRate });

serialport.on('open', () => {
  console.log('connected to serial port: ', path);
});

let buffer = Buffer.alloc(0);

serialport.on('data', chunk => {
  buffer = Buffer.concat([buffer, chunk]);

  let delimiterIndex = buffer.indexOf('ffe1', 0, 'hex');
  while (delimiterIndex !== -1) {
    const packet = buffer.slice(0, delimiterIndex);
    console.log({
      buffer: packet,
      hex: packet.toString('hex'),
    });

    buffer = buffer.slice(delimiterIndex + 2);

    delimiterIndex = buffer.indexOf('ffe1', 0, 'hex');
  }
});
