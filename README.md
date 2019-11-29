# CS174AFinalProject

## Syllabus
1. 场景 枪(模型先不急) 门
2. 开关灯改变颜色 墙上密码
3. 以上步骤结束后根据时间，时间充裕则考虑是否增加机关／故事主线／风格装饰。无时间则按原计划
4. 密码箱界面 打开

## 细节
1. 位置移动http://www.alloyteam.com/2016/09/built-with-webgl-3d-maze-game/
2. 门 无交互 图片蒙皮(地板蒙皮)
3. 门把 target （图形设计）
4. 灯 没交互 光源变化 
5. 开关 光源控制 位置变化
6. 墙上字 开关变化直接显示



1. mousepicking (1/2 只能读当前颜色)
2. 游戏逻辑 枪 射击 钥匙 开门
3. texture装饰
4. 移动光／点光（scren to texture）
5. 碰撞检测／防止穿模
6. 音效
7. 鼠标晃动bug 


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

