const fs = require('fs');

const config = require('./vimeo.json');

const Vimeo = require('vimeo').Vimeo;
const lib = new Vimeo(config.client_id, config.client_secret, config.auth_token);

const fields_list = 'uri,name,description,link,duration,width,height,language,'
        + 'embed,created_time,modified_time,release_time,license,pictures';

const channel_ids = [
  'restfest2017',
  'restfest2016',
  'restfest2015',
  'restfest2014',
  'restfest2013',
  'restfest', // 2012
  'restfest2011'
];

function outputVideosAsJSON(body) {
  let fields = fields_list.split(',');
  body.data.forEach((item) => {
    let output = {};
    for (let key in item) {
      if (fields.indexOf(key) > -1) {
        output[key] = item[key];
      }
    }
    let json = JSON.stringify(output, null, '  ');
    //console.log('output', json);
    let id = output.uri.split('/')[2]; // uri is `/video/{id}`
    let file_path = `_data/raw/vimeo/${id}.json`;
    fs.writeFile(file_path, json, (err) => {
      if (err) console.error(err);
      console.log(file_path +' was written successfully');
    });
  });
}

function outputVideosAsYAML(body) {
  body.data.forEach((item) => {
    // YAML output
    let output = `---
layout: video
title: ${item.name}
`;
    if ('description' in item && null !== item.description) {
      output += 'description: >\n';
      // output multi-line descriptions indented because YAML
      item.description.split('\n').forEach((line) => {
        output += `  ${line}\n`;
      });
    }
    output += `
video_link: ${item.link}
`;

    // get the largest picture available--should match video size
    let size = item.pictures.sizes.filter((size) => size.width === item.width);
    if (size.length > 0) {
      size = size[0];
      output += `picture:
  width: ${size.width}
  height: ${size.height}
  src: ${size.link_with_play_button}
`;
    }
    output += `---
${item.embed.html}`;

    let video_id = item.uri.split('/')[2];
    let file_path = `_videos/${video_id}.md`;
    fs.writeFile(file_path, output, (err) => {
      if (err) console.error(err);
      console.log(file_path +' was written successfully');
    });

  });
}

function gatherChannelVideos(channel_id) {
  lib.request({
      path: `/channels/${channel_id}/videos`,
      query: {
        per_page: 100
      }
      // the `fields` filter didn't work here...sadly
    }, function(error, body, status_code, headers) {
      if (error) {
          console.error('error', error);
      } else {
        console.log('channel: ', channel_id);
        console.log('pages', body.total, body.page, body.per_page);
        outputVideosAsJSON(body);
//        outputVideosAsYAML(body);

      }

/*      console.log('status code');
      console.log(status_code);
      console.log('headers');
      console.log(headers);*/
    });
}

channel_ids.forEach((id) => {
  gatherChannelVideos(id);
});
