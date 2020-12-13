import React from "react";

function isVideo(name) {
  return name.indexOf(".mp4") > -1;
}

function isPicture(name) {
  return name.indexOf(".jpg") > -1;
}

function addSuffixPicturteAddress(name) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(`http://www.picture.com/${name}`);
    }, 1000);
  });
}

function addSuffixAddress(videoItem) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        poster: videoItem.poster,
        name: `http://www.video.com/${videoItem.name}`
      });
    }, 1000);
  });
}

function getPoster(name) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let newName = name.split(".")[0];
      resolve({
        poster: `http://www.video.com/${newName}.jpg`,
        name
      });
    }, 1000);
  });
}

export default function Promisetest() {
  let mockData = [
    {
      id: "1",
      content: "content 1",
      type: "mms",
      recodings: ["a.mp4", "a.jpg", "miss J.mp4"]
    },
    {
      id: "2",
      content: "content 2",
      type: "mms",
      recodings: ["d.jpg", "c.mp4", "b.mp4", "f.mp4", "b.jpg"]
    }
  ];
  function test() {
    return new Promise((resolve, reject) => {
      let data = Promise.all(
        mockData.map(async record => {
          const recodings = record.recodings;

          const pictureItemsData = recodings.filter(item => isPicture(item));

          // 组装图片前置地址
          let pictureDataWithAddress = await Promise.all(
            pictureItemsData.map(async item => {
              return await addSuffixPicturteAddress(item);
            })
          );

          record.pictureData = pictureDataWithAddress;

          const videoItemsData = recodings.filter(item => isVideo(item));

          // 组装视频poster封面
          let videoDataWithPoster = await Promise.all(
            videoItemsData.map(async item => {
              return await getPoster(item);
            })
          );

          // 组装视频播放前置地址
          let videoDataWithAddress = await Promise.all(
            videoDataWithPoster.map(async item => {
              return await addSuffixAddress(item);
            })
          );

          record.videoData = videoDataWithAddress;

          return record;
        })
      );
      resolve(data);
    });
  }

  test().then(res => console.log(res));
  return (
    <div>
      <p>Promise Test</p>
    </div>
  );
}
