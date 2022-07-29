function getAverageHex(imagePath) {
  const imgEl = document.createElement("img")
  imgEl.src = imagePath
  return new Promise((res, rej) => {
    imgEl.onload = () => {
      var blockSize = 5, // only visit every 5 pixels
        defaultRGB = { r: 0, g: 0, b: 0 }, // for non-supporting envs
        canvas = document.createElement('canvas'),
        context = canvas.getContext && canvas.getContext('2d'),
        data, width, height,
        i = -4,
        length,
        rgb = { r: 0, g: 0, b: 0 },
        count = 0;

      if (!context) {
        return defaultRGB;
      }

      height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
      width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

      context.drawImage(imgEl, 0, 0);

      try {
        data = context.getImageData(0, 0, width, height);
      } catch (e) {
      /* security error, img on diff domain */alert('x');
        return defaultRGB;
      }

      length = data.data.length;

      while ((i += blockSize * 4) < length) {
        ++count;
        rgb.r += data.data[i];
        rgb.g += data.data[i + 1];
        rgb.b += data.data[i + 2];
      }

      // ~~ used to floor values
      rgb.r = ~~(rgb.r / count);
      rgb.g = ~~(rgb.g / count);
      rgb.b = ~~(rgb.b / count);

      function ColorToHex(color) {
        var hexadecimal = color.toString(16);
        return hexadecimal.length == 1 ? "0" + hexadecimal : hexadecimal;
      }

      function ConvertRGBtoHex(red, green, blue) {
        return ColorToHex(red) + ColorToHex(green) + ColorToHex(blue);
      }
      res(ConvertRGBtoHex(rgb.r, rgb.g, rgb.b));

    }
  })
}


function generateRandomIntBetween(distA){
  let multiplier=Math.round(Math.random())*2-1
  let randNum=Math.floor(distA*Math.random())
  return multiplier*randNum
}
// function generateRandomFloatBetween(distA){
//   return Math.random() * distA
// }

export { getAverageHex , generateRandomIntBetween}