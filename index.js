import fetch from "node-fetch"
import fs from "fs"
import os from "os"

//starts the program    
function startProgram(){
    const group = createGroup();
    setInterval(
        function getDataAgain(){
            for (let i= 0; i < group.length; i++){
                getAPIData(group[i]);
            }
        } , 15   * 60 * 1000
    )
}

//constructor for a player
function player(playername, skills, firstTime){
    this.playername = playername;
    this.skills = skills;
    this.firstTime = firstTime;
}

//constructor for a skill
function skill(skillname, level){
    this.skillname = skillname;
    this.level = level;
}

//returns an array with player objects in them
function createGroup(){
    let nameArray = [];
    let groupArray = [];

    fs.readFileSync('players.txt', 'utf-8').split('/\r?\n/').forEach(line =>{
        nameArray = line.split('\r\n');
    })

    for (let i = 0; i < nameArray.length; i++){
        groupArray.push(createPlayer(nameArray[i]));
    }
    return groupArray;
}

function getAPIData(player){
    const url = `https://secure.runescape.com/m=hiscore_oldschool/index_lite.ws?player=${player.playername}`;
    fetch(url).then(function(response){
        return response.text();
    })
    .then(function(response){
        //splits the reponse at every comma
        let splittedArray = response.split(",");
        let levelsArray = [];

        //removes the rank and the total experience and puts the level in an array
        for(let i=1; i < splittedArray.length; i = i + 2){
            levelsArray.push(splittedArray[i]);
        }

        //removes the boss and clue stats so that there are only levels in the array
        let statsplayer = levelsArray.slice(0, 24);
        compareStats(player, statsplayer);

        //makes firsttime false so that you won't get a message the first time you run the program
        player.firstTime = false;
    }).
    catch(error =>{
        console.log(error);
    })
}


//compares the stats from the hiscores with the one stored in the object
function compareStats(player, statsplayer){
    for (let i=0; i < player.skills.length; i++){
        if (player.skills[i].level != statsplayer[i + 1]){ 
            player.skills[i].level = statsplayer[i + 1];

            //sends a message if there is a diffirence
            if(!player.firstTime){
                gzMessage(player.playername, player.skills[i].skillname, player.skills[i].level);
            }    
        }
    }
}

//sends a message based on the playername, skillname and skilllevel
//the checks are there because of some random bug which i don't understand
function gzMessage(playername, skillname, skilllevel){
    const message = `${playername} has reachted level ${skilllevel} in ${skillname}`;
    const badMessage = message;

    //writes to a file to spot potential strange messages
    fs.appendFile('error.txt', makeTimeStamp() + badMessage + os.EOL, err => {
        //console.log("Recieved bad message");
    });

    //checks if the level is valid
    if (skilllevel > 99 || skilllevel < 1 || skilllevel.length > 3){
        return;
    }

    //checks if the skillname is valid
    if (skillname.length > 20){
        return;
    }

    //writes to a file to spot potential strange messages
    fs.appendFile('log.txt', makeTimeStamp() + message + os.EOL, err => {
        return;
    });

    console.log(message);
}

//returns a timestamp that gets writen to a .txt file 
function makeTimeStamp(){
    const time = new Date()
    const date = `${time.getDate()}/${time.getMonth()+1}/${time.getFullYear()}`;

    let hours = addLeadingZero(time.getHours());
    let minutes = addLeadingZero(time.getMinutes());
    let seconds = addLeadingZero(time.getSeconds());

    const timestamp = `${date} ${hours}:${minutes}:${seconds} `;
    return timestamp;
}

//adds a zero number lower than 10 for the timestamp
function addLeadingZero(number){
    if (number < 10){
        return '0' + number;
    }
    return number;
}

//returns a player object
function createPlayer(playername){
    let createdPlayer = new player(
        playername,
        [
            new skill("Attack", 0),
            new skill("Defence", 0),
            new skill("Strength", 0),
            new skill("Hitpoints", 0),
            new skill("Ranged", 0),
            new skill("Prayer", 0),
            new skill("Magic", 0),
            new skill("Cooking", 0),
            new skill("Woodcutting", 0),
            new skill("Flechting", 0),
            new skill("Fishing", 0),
            new skill("Firemaking", 0),
            new skill("Crafting", 0),
            new skill("Smithing", 0),
            new skill("Mining", 0),
            new skill("Herblore", 0),
            new skill("Agility", 0),
            new skill("Thieving", 0),
            new skill("Slayer", 0),
            new skill("Farming", 0),
            new skill("Runecrafting", 0),
            new skill("Hunter", 0),
            new skill("Construction", 0)
        ],
        true
    );
    return createdPlayer;
}  

//starts the program
startProgram();