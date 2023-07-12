import { CustomFile } from './FileUpload'

const filesData: CustomFile[] = [
  {
    file: {
      name: 'images.zip',
      type: 'application/zip',
      size: 92399,
    },
    sequenceNumber: null,
    sequenceId: null,
  },
  {
    file: {
      name: 'editor_creating_multiple_tasks.mov',
      type: 'video/quicktime',
      size: 4437306,
    },
    message: 'File was too big. Max size is 2MB',
    sequenceNumber: null,
    sequenceId: null,
  },
  {
    file: {
      name: 'robot.png',
      type: 'image/png',
      size: 11972,
    },
    sequenceNumber: null,
    sequenceId: null,
  },
  {
    file: {
      name: 'Hand Drawn Shapes.ttf',
      type: 'font/ttf',
      size: 69924,
    },
    sequenceNumber: null,
    sequenceId: null,
  },
  {
    file: {
      name: 'a_really_really_really_really-01-long-filename-just-so-incredibly-it-is-actually-painful-how-long-this-filename-is-1.png',
      type: 'image/png',
      size: 7051,
    },
    sequenceNumber: 1,
    sequenceId:
      'a_really_really_really_really-01-long-filename-just-so-incredibly-it-is-actually-painful-how-long-this-filename-is-[1-3].png',
  },
  {
    file: {
      name: 'a_really_really_really_really-01-long-filename-just-so-incredibly-it-is-actually-painful-how-long-this-filename-is-2.png',
      type: 'image/png',
      size: 23780,
    },
    sequenceNumber: 2,
    sequenceId:
      'a_really_really_really_really-01-long-filename-just-so-incredibly-it-is-actually-painful-how-long-this-filename-is-[1-3].png',
  },
  {
    file: {
      name: 'a_really_really_really_really-01-long-filename-just-so-incredibly-it-is-actually-painful-how-long-this-filename-is-3.png',
      type: 'image/png',
      size: 23780,
    },
    sequenceNumber: 3,
    sequenceId:
      'a_really_really_really_really-01-long-filename-just-so-incredibly-it-is-actually-painful-how-long-this-filename-is-[1-3].png',
  },
  {
    file: {
      name: 'bin_00001.jpg',
      type: 'image/jpeg',
      size: 11972,
    },
    sequenceNumber: 1,
    sequenceId: 'bin_[1-4].jpg',
  },
  {
    file: {
      name: 'bin_00002.jpg',
      type: 'image/jpeg',
      size: 7051,
    },
    sequenceNumber: 2,
    sequenceId: 'bin_[1-4].jpg',
  },
  {
    file: {
      name: 'bin_00003.jpg',
      type: 'image/jpeg',
      size: 23780,
    },
    sequenceNumber: 3,
    sequenceId: 'bin_[1-4].jpg',
  },
  {
    file: {
      name: 'bin_00004.jpg',
      type: 'image/jpeg',
      size: 22982,
    },
    sequenceNumber: 4,
    sequenceId: 'bin_[1-4].jpg',
  },
  {
    file: {
      name: 'bin_00001.png',
      type: 'image/png',
      size: 11972,
    },
    sequenceNumber: 1,
    sequenceId: 'bin_[1-7].png',
    message: 'Failed to upload.',
  },
  {
    file: {
      name: 'bin_00002.png',
      type: 'image/png',
      size: 7051,
    },
    sequenceNumber: 2,
    sequenceId: 'bin_[1-7].png',
  },
  {
    file: {
      name: 'bin_00003.png',
      type: 'image/png',
      size: 24146,
    },
    sequenceNumber: 3,
    sequenceId: 'bin_[1-7].png',
    message: 'Failed to upload.',
  },
  {
    file: {
      name: 'bin_00004.png',
      type: 'image/png',
      size: 22982,
    },
    sequenceNumber: 4,
    sequenceId: 'bin_[1-7].png',
  },
  {
    file: {
      name: 'bin_00005.png',
      type: 'image/png',
      size: 19388,
    },
    sequenceNumber: 5,
    sequenceId: 'bin_[1-7].png',
  },
  {
    file: {
      name: 'bin_00006.png',
      type: 'image/png',
      size: 23880,
    },
    sequenceNumber: 6,
    sequenceId: 'bin_[1-7].png',
  },
  {
    file: {
      name: 'bin_00007.png',
      type: 'image/png',
      size: 23137,
    },
    sequenceNumber: 7,
    sequenceId: 'bin_[1-7].png',
  },
  {
    file: {
      name: 'bin_shadow-00001.png',
      type: 'image/png',
      size: 11972,
    },
    sequenceNumber: 1,
    sequenceId: 'bin_shadow-[1-2, 5-7].png',
  },
  {
    file: {
      name: 'bin_shadow-00002.png',
      type: 'image/png',
      size: 7051,
    },
    sequenceNumber: 2,
    sequenceId: 'bin_shadow-[1-2, 5-7].png',
  },
  {
    file: {
      name: 'bin_shadow-00005.png',
      type: 'image/png',
      size: 19388,
    },
    sequenceNumber: 5,
    sequenceId: 'bin_shadow-[1-2, 5-7].png',
  },
  {
    file: {
      name: 'bin_shadow-00006.png',
      type: 'image/png',
      size: 23880,
    },
    sequenceNumber: 6,
    sequenceId: 'bin_shadow-[1-2, 5-7].png',
  },
  {
    file: {
      name: 'bin_shadow-00007.png',
      type: 'image/png',
      size: 23137,
    },
    sequenceNumber: 7,
    sequenceId: 'bin_shadow-[1-2, 5-7].png',
  },
  {
    file: {
      name: 'bin_twos.00001.png',
      type: 'image/png',
      size: 11972,
    },
    sequenceNumber: 1,
    sequenceId: 'bin_twos.[1--7].png',
  },
  {
    file: {
      name: 'bin_twos.00003.png',
      type: 'image/png',
      size: 23780,
    },
    sequenceNumber: 3,
    sequenceId: 'bin_twos.[1--7].png',
  },
  {
    file: {
      name: 'bin_twos.00005.png',
      type: 'image/png',
      size: 19388,
    },
    sequenceNumber: 5,
    sequenceId: 'bin_twos.[1--7].png',
  },
  {
    file: {
      name: 'bin_twos.00007.png',
      type: 'image/png',
      size: 23137,
    },
    sequenceNumber: 7,
    sequenceId: 'bin_twos.[1--7].png',
    message: 'Failed to upload.',
  },
]

export default filesData
