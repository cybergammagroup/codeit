
// function runs in loadFile() in gitsidebar.js
// if isMobile
function updateFloat() {

  // close sidebar
  toggleSidebar(false);
  saveSidebarStateLS();

  // show bottom floater
  bottomFloat.classList.remove('hidden');

  // if selected file is modified, show flag
  if (!selectedFile.eclipsed &&
      modifiedFiles[selectedFile.sha]) bottomFloat.classList.add('modified');
  else bottomFloat.classList.remove('modified');

  // show selected file name
  floatLogo.innerText = selectedFile.name;

}


// open sidebar when clicked on button
sidebarOpen.addEventListener('click', () => {

  toggleSidebar(true);
  saveSidebarStateLS();

  let selectedEl = fileWrapper.querySelector('.item.selected');

  if (selectedEl) {

    // scroll to selected file
    selectedEl.scrollIntoViewIfNeeded();

  }

})


function playPushAnimation(element) {

  const endAnimDuration = 0.18; // s
  const checkDelay = 2 - endAnimDuration;

  element.classList.add('checked');

  window.setTimeout(() => {

    element.classList.remove('checked');

  }, (checkDelay * 1000));

}

// show push icon in button
pushWrapper.innerHTML = pushIcon;

// push when clicked on button
pushWrapper.addEventListener('click', async () => {

  // get selected file element
  let selectedEl = fileWrapper.querySelector('.file.modified[sha="'+ selectedFile.sha +'"]');
  
  if (selectedEl) {

    pushFileFromHTML(selectedEl);

  }

})


// if on mobile device
if (isMobile) {

  // show bottom float when scrolled up

  let lastScrollTop = 0;

  cd.addEventListener('scroll', function() {

    var st = cd.scrollTop;

    // if scrolled down
    if (st > lastScrollTop) {

      // hide bottom float
      bottomFloat.classList.add('hidden');

      // if scrolled to end
      if (st >= cd.scrollHeight) {

        // set timeout
        window.setTimeout(() => {

          // if still on bottom of codeit
          if (st >= cd.scrollHeight) {

            // show bottom float
            bottomFloat.classList.remove('hidden');

          }

        }, 400);

      }

    } else { // if scrolled up

      // if passed threshold
      if ((lastScrollTop - st) > 20) {

        // show bottom float
        bottomFloat.classList.remove('hidden');

      }

    }

    lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling

  }, false);

}
