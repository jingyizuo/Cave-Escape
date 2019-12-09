
# CS174A Final Project
# Cave Escape by Team In-N-Out 
## Game Description

* **Background**:  
  You were kidnapped by a group of heresy. These people imprisoned you in a dark cave. You overheard their conversation and knew that they intended to sacrifice you to their evil gods. They just left for making preparations of the sacrificial cult, you must solve the riddle of this cave, find the way and escape before they come back.  
  
* **Implementation**:  
  1. **Download** the file from this repo on GitHub  
  2. Click and run **host.bat** for Windows, **host.command** for Mac  
  3. Open the file **start.html** to start the game locally  
  
* **Controls**:  
  
  1. Move around with **W, A, S, D**  
  2. Look around with **the mouse**  
  3. Pick up items by **clicking**  

* **What you can do with our game**:  

  1. Interaction by clicking items  
  2. Escape the room with the hints  
  3. Look and move around in the cave  

## Who did what
* Jingyi Zuo:  

  Mouse control parts. Project the 2D movement of mouse into 3D world, which helps realizing the lookaround and movearound feature. Read the mouse movementX and movementY each frame. Based on the relative change of mouse position, calulate the perspective and camera movement.   
![FREE_MOVE](screenshot_README/free_move.gif)  
  
  Mouse picking with framebuffers. Set up an off-screen framebuffer inwhich each item has an unique and uniform color (via a shader extends from Phong_Shader). By each click, read out the color of pixels on off-screen framebuffer in Webgl-Manager Class and pass it back to our check function. Reading out pixels in mousedown event and checking in mouseup event.  
![MOUSE_PICKING](screenshot_README/mouse_picking.gif)  
  Implement light changes in the game.  
  
  Game logics.  
  
* Jiani Liu:

  Design some game puzzles.
  
  Mouse picking. Using framebuffer to render interactive objects into different colors on offscreen, and binding the scene into offscreen framebuffer. Then, the color corresponding to the coordinates of the aim can be read and the program can determine which object is selected. 
  
  Fire simulation, which essentially simulates fire on cave through particle diffusion. Each particle is assigned with coordinates, rgb value, life time that change with time. Therefore, particle diffusion simulates the shape of the flame. The rgb values simulate the flame with yellow center and red outter part. Flames are imported into the scene via screen to texture. 
  
 ![mouse picking](screenshot_README/torchoff.png)
  

![mouse picking](screenshot_README/torchon.png)
 
 Sound effects.

* Weikang Yang:

  Design game scene.
  
  Generate the 3D models. Use Blender 2.80 to generate the 3D models, then export them as obj files. Further, use tiny graphics/ obj-files-demo to import these models into the project, construct them as the game scene. 
  
  Create and design the GAME START and GAME END pages . To improve the user experience, create two new .html files, use HTML and CSS to create button menu in the START page, link the button to the index.html which is the context of the game. Further, to make landscaping of the pages, record the game scene video and convert to .gif file and use it as background. 


![GAME START](screenshot_README/start.jpg)
    
  Design the background of the game.
  
  
--------------------------------------------------------------------------------------------------------------------------------------------------------------
Our project is a first-person room escape game. The player will control a person locked in a room and try to find clues and props in order to get out.  
There are currently two puzzles in the room. Player needs to solve them in a certain order to get out of the room. When the main character turns off the light, a fluorescent password will appear. Then the character can open a safe box using the password. A pistol will appear and the character then can broke the door lock with the pistol and escape. The interactions involved in the game are:  
  The movement of the protagonist's position and the changing point of view.  
  The main character can click items in the room and trigger certain events.  
Clickable items:  
  Light switch: turn on/off the light.  
  Safe box: the password input interface will appear. Player can input numbers.  
  Pistol: appear when the safe box is open. The character can hold the pistol by clicking. After that clicking is equal to shooting.  
  Door: If the character is not equipped with a pistol, a message “locked” will pop up. If the character is equipped with a pistol and clicks, it will be destroyed. Game over.  
  We will use vertex arrays indexing, polygons, and interpolation to model the room and the props. Viewing and projections will be used to simulate the first-person point of view. We also use lighting in order to accomplish one of the puzzles. We may use Ray Tracing to improve the feeling of presence.  
  We may also use the skinning technical introduced on this link:
https://webglfundamentals.org/webgl/lessons/webgl-skinning.html  

