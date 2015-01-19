var fs = require('fs')
var rimraf = require('rimraf')
var marked = require('marked')

var markdown = fs.readFileSync('./pages.md', 'utf8')
var sections = parsePages(markdown)

sections.forEach(function(section){
  fs.writeFileSync('./'+section.name+'.html', section.content) 
})

function createNav(sections) {
  var html = ''
  html += '<h1><a class="navlink" href="index.html">Wolf Cabin</a></h1>'
  html += '<div class="navwrapper">'
  html += '<div class="navpanel">'
  sections.forEach(function(section, i){
    if(i !== 0) // don't add a navlink for index
      html += '<div><a class="navlink pagelink" href="'+section.name+'.html">'+section.name+'</a></div>'
  })
  html += '<hr>'
  html += '</div>'
  html += '</div>'

  return html
}

function parsePages(markdown) {
  //split the content into sections
  var chunks = markdown.split('##')
  //remove the first split which is junk
  chunks.shift()
  //get the headers
  var sections = []
  chunks.forEach(function(chunk, i) {
    //split the chunk into lines
    var lines = chunk.split('\n')
    //get the name and remove it from the list of lines
    var name = lines[0]
    lines.shift()
    //mash the rest into a string representing the content
    var html = ''
    html += '<html>'
    html += '<head>'
    html += '<link rel="stylesheet" type="text/css" href="site.css">'
    html += '</head>'
    html += '<body>'
    html += '%nav%'
    html += '<div class="content">' + marked(lines.join('\n')) + '</div>'
    html += '</body></html>'
    sections.push({name: name, content: html})
  })
  sections.forEach(function(section){
    section.content = section.content.split('%nav%').join(createNav(sections))
  })
  return sections
}


