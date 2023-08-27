const process = require("child_process");

function run(command) {
  let err = null;
  let res = "";
  try {
    res = process.execSync(command, { encoding: "utf-8" });
  } catch (error) {
    err = error;
  }
  return [err, res];
}

function cutAudio_sseof(input, output, sseof) {
  sseof = Number.parseFloat(sseof);
  if (Number.isNaN(sseof)) {
    return;
  }
  if (sseof > 0) {
    return;
  }
  const [err, stdout] = run(
    `ffmpeg -y -v error -sseof ${sseof} -i "${input}" -c copy "${output}"`,
  );
  if (err) {
    throw new Error(err);
  } else {
    return stdout;
  }
}

function cutAudioFromEnd(input, output, end) {
  end = Number.parseFloat(end);
  if (Number.isNaN(end)) {
    return;
  }

  if (end < 0) {
    const duration = getDuration(input);
    const end_point = Math.max(
      0,
      (Number.parseFloat(duration) + end).toFixed(4),
    );
    const [err, _] = run(
      `ffmpeg -y -v error -to ${end_point} -i "${input}" -c copy "${output}"`,
    );
    if (err) {
      throw new Error(err);
    }
  }
}
function getDuration(inputUrl) {
  const [err, res] = run(
    `ffprobe -v error -select_streams a:0 -show_entries format=duration -of default=nw=1:nk=1 "${inputUrl}"`,
  );
  if (!err) {
    return res;
  }
  throw new Error(err);
}
module.exports = {
  run,
  getDuration,
  cutAudioFromEnd,
  cutAudio_sseof,
};
