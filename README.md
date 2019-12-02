
# CS174A-Final-Project


Our project is a first-person room escape game. The player will control a person locked in a room and try to find clues and props in order to get out. 
There are currently two puzzles in the room. Player needs to solve them in a certain order to get out of the room. When the main character turns off the light, a fluorescent password will appear. Then the character can open a safe box using the password. A pistol will appear and the character then can broke the door lock with the pistol and escape.The interactions involved in the game are: 
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
