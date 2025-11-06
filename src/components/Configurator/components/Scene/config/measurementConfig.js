// src/config/measurementConfig.js
export const measurementConfig = {
    // Example mesh: Left Armrest
    pCube33: {
      show: ["width","height","depth"], // show
      gap: { width: 0, height: 15, depth: 15 },
      offset: {
        width: { x:0, y: 40, z: 60 },
        height: { x: 0, y:0, z: 60 },
        depth: { x: 20, y: 40 , z:0 },
      },
      extraOffsetLabel:{
        width: { x:0, y: 7, z: 0 },
        height: { x: 0, y:0, z: 0 },
        depth: { x: 0, y: 0 , z:0 },
      }
    },
  
    // Example mesh: Back Frame (only width & height)
    pCube4: {
      show: ["width", "height"],
      gap: { width: 20, height: 15, depth: 15 },
      offset: {
        width: { x:0, y: 80, z: -15 },
        height: { x: -190, y:0, z: -20 },
      },
      extraOffsetLabel:{
        width: { x:0, y:0, z: 0 },
        height: { x: 0, y:0, z: 0 },
        depth: { x: 0, y: 0 , z:0 },
      }
    },
  
    // Example mesh: Middle SeatCushion (only width)
    ["mx:Plane008 polySurface24"]:{
        show: ["width",],
        gap: { width: 15, height: 15, depth: 15 },
        offset: {
          width: { x:0, y: 10, z: 50 },
        },
        extraOffsetLabel:{
            width: { x:0, y: 0, z: 0 },
            height: { x: 0, y:0, z: 0 },
            depth: { x: 0, y: 0 , z:0 },
          }
    }
  
    // Add more meshes here...
  }
  