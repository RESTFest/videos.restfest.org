# videos.restfest.org
Curation space for the REST Fest Videos Project content

## Currently

The `videos.restfest.org` sub-domain redirects to the [previous year's Vimeo channel](https://vimeo.com/channels/restfest2017). This is fine, but there's *so much more* we'd like to add, do, extend, etc.

## The Plan

We'd like this to be a GitHub Pages hosted static site with pages that "wrap" each video with additional content about the speaker, the content, topics, etc. We'd like it to be static, so it has the longest possible lifespan. However, that doesn't mean we can't use every availalbe REST API to generate/extract the content we need to build an amazing site. It also doesn't preclude any use of client-side REST API access for augmenting the static site when the page is loaded. Lot's of possibilites.

Checkout the [Projects](https://github.com/RESTFest/videos.restfest.org/projects) and [Issues](https://github.com/RESTFest/videos.restfest.org/issues) areas of the [GitHub repo](https://github.com/RESTFest/videos.restfest.org) for more actionable info.

## Tools

* [Vimeo Videos API](https://developer.vimeo.com/api) - specifically the [/users/{user_id}/videos](https://developer.vimeo.com/api/endpoints/videos#GET/users/{user_id}/videos) endpoint
  * all Vimeo API requests need at least a public access token
* [Ti.to](https://ti.to/) - for attendee/speaker info
  * no API (yet), but does have Webhooks and data exports
* Twitter, Buffer, etc? - for promoting videos post-event and throughout the year

## Development

The site uses [Jekyll](http://jekyllrb.com/) to generate a static,
[Semantic-UI](http://semantic-ui.com/) based site.

You'll need [Ruby](https://www.ruby-lang.org/).

```
$ gem install jekyll bundler
$ bundle install # the jekyll bits
$ npm i # the semantic-ui bits
$ npm run build # once. not needed again unless customizing semantic.css
$ npm run serve # which runs `bundle exec jekyll serve --incremental`
```

## License
Apache License 2.0
