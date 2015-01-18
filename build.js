var fs = require('fs')
var rimraf = require('rimraf')
var marked = require('marked')

rimraf.sync('./www')
fs.mkdirSync('./www')

var markdown = fs.readFileSync('./index.md', 'utf8')

var sections = parsePages(markdown)

sections.forEach(function(section){
  fs.writeFileSync('./www/'+section.name+'.html', section.content) 
})

createIndex(sections)

fs.writeFileSync('./www/site.css', fs.readFileSync('./site.css', 'utf8'))

function createIndex(sections) {
  var html = ''
  html += '<html>'
  html += '<head>'
  html += '<link rel="stylesheet" type="text/css" href="site.css">'
  html += '</head>'
  html += '<body>'
  html += '<h1>Wolf Cabin</h1>'
  sections.forEach(function(section){
    html += '<h3><a href="'+section.name+'.html">'+section.name+'</a></h3>'
  })
  html += '</body></html>'
  fs.writeFileSync('./www/index.html', html) 
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
    html += marked(lines.join('\n'))
    html += '<a href="index.html">home</a>'
    html += '</body></html>'
    sections.push({name: name, content: html})
  })
  return sections
}


