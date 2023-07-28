Agency Jekyll theme
====================

Agency theme based on [Agency bootstrap theme ](https://startbootstrap.com/template-overviews/agency/)

The resulting jekyll theme uses Ruby >=2.5, GCC and Make. For more information on specific OS setting see: https://jekyllrb.com/docs/installation/



# How to install


- copy the brainhack repository
$ git clone https://github.com/Brainhack-Donostia/brainhack-donostia.github.io.git
-move to brainhack repository
$ cd brainhack-donostia.github.io.git
$ bundle install
-To check local changes or to display on a local host 
$ bundle exec jekyll serve --trace
or
$ jekyll serve 

#Git branches

Commit and push changes on BHD2023 or a personal sub-branch from there. When you are sure about your changes, push them to BHD2023 and open a pull request.
NOTE: remember to run pull before working locally
-Changing to BHD2023 branch
$ git checkout BHD2023
- Creating your subranch from BHD2023
$ git checkout -b YourAmazingSubbranch
- Checking the status of the current branch
$ git status
- Adding untracked changes
$ git add filename1 filename2 
or to add all
$ git add .
- Commit changes
$ git commit -m "Your message explaining your commited work"
- Push changes from locall to repo
$ git push -u origin BHD2023
- Merging with master
$ git checkout master 
$ git merge BHD2023 
- You could also push your commit to a specific branch intead of merging and without checkout master
$ git push -u origin master

## How to use

To edit the format of the page, you will find everything inside 'your/system/path/brainhack-donostia.github.io/_/_includes'

Within such folder you will find several html named after the section they stand for. As an example,to change the 'about us' section you should edit the services.html. There if you want to have different paragrafs, you should have a class section for each paragraph:
'<h3 class="section-subheading textmuted">
Your amazing first paragraph. </h3>
<h3 class="section-subheading textmuted">
Your amazing second paragraph. </h3>'

 
###Portfolio 

Portfolio projects are in '/_posts'

You need to create a markdown for each post. The files must be named something like this:
yyyy-mm-dd-project-n.markdown , i.e., 2023-01-01-project-1.markdown

Images are in /img/portfolio'

###Images

Images are in 'your/system/path/brainhack-donostia.github.io/img'

Team subfolder contains the pictures of BHD 2023 team. Images are 620px*820px
Portfolio subfolder contains the pictures to be displayed for the calendar and the talks section:
-thumbnails: '400px*289px'
-Displayed image when clicked: 600px*450px
About subfolder contains the images to be displayed on BHD timeline. Images are 200px*200px
Logos subfolder contains the images for the header, projects,register, and the sponsors section :
-header background: 1900px*1250px
-contact and register: 1469px*725px
-sponsors: 295px*86px

###Team

Team members and info are in '_config.yml'You can add aditional information as twitter, facebook, stack-overflow and linkedin:
- name: Grogru
  pic: babyyoda.png
  position: Cuteness leader
  social:
    - title: twitter
      url: # 
    - title: facebook
      url: #
    - title: stack-overflow
      url: #

# To do
- Add posts for each one of the speakers and one for the calendar
- Try to add a link to a google calendar file or similar
- Change images from the timeline
- Change colors for the lettering (probably on /_includes/css/agency.css )

=========
For more details, read [documentation](http://jekyllrb.com/)
