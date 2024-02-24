import { SerialPort } from 'serialport';

const path = '/dev/ttyUSB0';
const baudRate = 9600;

const serialport = new SerialPort({ path, baudRate });

serialport.on('open', () => {
  console.log('connected to serial port: ', path);
});

const delimiter = Buffer.from('ffe1', 'hex');

let dataBuffer = Buffer.alloc(0);

serialport.on('data', chunk => {
  dataBuffer = Buffer.concat([dataBuffer, chunk]);

  let delimiterIndex = dataBuffer.indexOf(delimiter);

  while (delimiterIndex !== -1) {
    // clear delimiter
    const delimiterPacket = dataBuffer.subarray(0, delimiterIndex);
    const packet = delimiterPacket.subarray(2);

    console.log({
      utf8: packet.toString('utf-8'),
    });

    dataBuffer = dataBuffer.subarray(delimiterIndex + 2);
    delimiterIndex = dataBuffer.indexOf(delimiter);
  }

  // while (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
  //   const data = dataBuffer.slice(startIndex + 4, endIndex);

  //   console.log({
  //     data,
  //   });

  //   dataBuffer = dataBuffer.slice(endIndex + 4);

  //   startIndex = dataBuffer.indexOf(startDelimiter);
  //   endIndex = dataBuffer.indexOf(endDelimiter);
  // }
});
