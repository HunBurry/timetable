/**
 * @author Hunter Berry <hunter.berry@vikings.berry.edu>
 */
(function () {

    /*
      Known Issues:
       1. When editing a class that is within a group div, it messed the classes up.
     */

    let curDrag;
    let courses = [];
    let colorScheme = {
        "Evans": "blue",
        "Mac": "purple",
        "Cook": "red",
        "Laughlin": "pink",
        "Green": "green",
        "Moon": "yellow",
        "Cage": "orange",
        "HackBerry": "navy",
        "Sister's Hall": "maroon"
    }
    let dict2 = {}
    let dict3 = {}

    //drop()

    /**
     * Represents a Course that is being offered in the given semester. 
     * @constructor
     * @param {string} division - The division/major area that a course falls under.
     * @param {string} code - The courses complete code, consiting of a three-letter department, a three digit number, and a section letter.
     * @param {string} name - The full name of the course.
     */
    function Course(division, code, name, days, startingTime, endingTime, courseID, building, room, teacher) {
        this.division = division;
        this.code = code;
        this.name = name;
        this.days = days;
        this.startingTime = startingTime;
        this.endingTime = endingTime;
        this.courseID = courseID;
        this.building = building;
        this.teacher = teacher;
        this.room = room;
    }

    window.onload = function() {
        makeCourses();
        document.getElementById("buildings").onchange = sel;
        let q = document.querySelectorAll("#buildings option");
        for(let i = 1; i < q.length; i++) {
            document.getElementById(q[i].value).onclick = sel2;
        }
        let z = document.querySelectorAll(".day");
        for(let i = 0; i < z.length; i++) {
            z[i].addEventListener("dragover", dragover)
            z[i].addEventListener("dragenter", dragenter)
            z[i].addEventListener("drop", drop)
        }
        document.getElementById("makeNew").onclick = singleCourseButtonModal;
        let hold1 = 326;
        var d = new Date(2018, 11, 24, 8, 0, 0, 0);
        console.log(d)
        let hold2 = 0;
        for (let x = 0; x < 48; x++) {
            dict2[hold1] = hold2;
            dict3[hold2] = fix(d.getHours(), d.getMinutes())
            hold1 = hold1 + 47;
            hold2 = hold2 + 2.0833333
            d = moment(d).add(15, 'm').toDate();
        }
    }
    function fix(ho, min) {
        let hour = ho;
        let minutes = min;
        let newH = "";
        let newM = "";

        if(hour < 10) {
            newH = "0" + hour;
        }
        else {
            newH = hour;
        }
        if(minutes == 0) {
            newM = "00"
        }
        else {
            newM = minutes;
        }
        return (newH + ":" + newM)
    }

    function sel2() {
        let val = this.value;
        let y = document.querySelectorAll(".time-entry");
        for (let i = 0; i < y.length; i++) {
            y[i].parentElement.removeChild(y[i]);
        }
        if (val == "All") {
            rebuildByBuilding(this.id);
        }
        else {
            rebuildByDivision(val);
        }
    }

    function sel() {
        let val = document.getElementById("buildings").value;
        let d = document.querySelectorAll(".selSec")
        for (let i = 0; i < d.length; i++) {
            d[i].classList.add("hide");
        }
        if (val != "All") {
            document.getElementById(val).classList.remove("hide");
        }
        let y = document.querySelectorAll(".time-entry");
        for (let i = 0; i < y.length; i++) {
            y[i].parentElement.removeChild(y[i]);
        }
        if (val == "All") {
            makeCourses();
        }
        else {
            rebuildByBuilding(val);
        }
    }

    function singleCourseButtonModal() {
        /*
        still need one for courseCode and Days. 
        */
        let d = document.createElement("div");
        d.id = "myModal";
        d.classList.add("modal");
        let d2 = document.createElement("div");
        d2.classList.add("modal-content");
        let head = document.createElement("div");
        head.style.backgroundColor = "blue"
        head.classList.add("modal-header");
        let h2 = document.createElement("h2");
        h2.innerText = "Create a New Course Offering"
        let con = document.createElement("div");
        con.classList.add("moral-body");
        let s = document.createElement("span");
        s.classList.add("close");
        s.onclick = function() {
            document.getElementById("myModal").style.display = "none";
            document.getElementById("container").removeChild(document.getElementById("myModal"));
          }
        let e = document.createElement("input");
        e.setAttribute("type", "time");
        e.id = "setStart"
        let e2 = document.createElement("input");
        e2.setAttribute("type", "time");
        e2.id = "setEnd"
        let e3 = document.createElement("input");
        e3.setAttribute("type", "text");
        e3.id = "name"
        let e4 = document.createElement("input");
        e4.setAttribute("type", "text");
        e4.id = "room"
        let e5 = document.createElement("input");
        e5.setAttribute("type", "text");
        e5.id = "professor"
        let e6 = document.createElement("input");
        e6.setAttribute("type", "text");
        e6.id = "days"
        let e7 = document.createElement("input");
        e7.setAttribute("type", "text");
        e7.id = "code"
        let but = document.createElement("button");
        but.id = "makeNewCourse"
        but.innerText = "Sumbit Changes";
        head.appendChild(s);
        head.appendChild(h2);
        con.append(document.createElement("hr"))
        let p3 = document.createElement("p");
        p3.innerText = "Ending Time";
        let p2 = document.createElement("p");
        p2.innerText = "Starting Time";
        con.appendChild(p2)
        con.appendChild(e)
        con.appendChild(p3)
        con.appendChild(e2);
        let p6 = document.createElement("p");
        p6.innerText = "Room";
        con.appendChild(p6)
        con.appendChild(e3)
        let p4 = document.createElement("p");
        p4.innerText = "Professor";
        con.appendChild(p4)
        con.appendChild(e4)
        let p5 = document.createElement("p");
        p5.innerText = "Course Name";
        let p7 = document.createElement("p");
        p7.innerText = "Code";
        let p8 = document.createElement("p");
        p8.innerText = "Days (seperate by commas).";
        con.appendChild(p5)
        con.appendChild(e5)
        con.appendChild(p7)
        con.appendChild(e7)
        con.appendChild(p8)
        con.appendChild(e6)
        console.log(e7)
        let clone = document.getElementById("buildings").cloneNode(true);
        clone.id = "buildingsModal";
        clone.onchange = function() {
            if (document.getElementById("division") == null) {
                let clone2 = document.getElementById(clone.value).cloneNode(true);
                clone2.id = "division";
                clone2.classList.remove("hide")
                con.appendChild(clone2)
            }
            else {
                con.removeChild(document.getElementById("division"))
                let clone2 = document.getElementById(clone.value).cloneNode(true);
                clone2.id = "division";
                clone2.classList.remove("hide")
                con.appendChild(clone2)
            }
        }
        con.appendChild(clone)
        but.onclick = function() {
            let co = document.getElementById("code").value
            if (!Object.keys(courses).includes(co)) {
                let start = document.getElementById("setStart").value
                let ro = document.getElementById("room").value
                let na = document.getElementById("name").value
                let end = document.getElementById("setEnd").value
                let pro = document.getElementById("professor").value
                let dayArr = document.getElementById("days").value
                let bul = document.getElementById("buildingsModal").value
                let div = document.getElementById("division").value
                makeSingleCourseAndSpan(co, na, bul, div, pro, start, end, dayArr, ro)
                document.getElementById("myModal").style.display = "none";
                document.getElementById("container").removeChild(document.getElementById("myModal"));
            }
            else {
                alert("A class with this code is already in the list. Please try again.")
            }
        }
        con.appendChild(but);
        d2.appendChild(head);
        d2.appendChild(con);
        d.appendChild(d2);
        d.style.display = "block";
        document.getElementById("container").appendChild(d);
        console.log("hello")
        window.onclick = function(event) {
            if (event.target == document.getElementById("myModal")) {
                document.getElementById("myModal").style.display = "none";
                document.getElementById("container").removeChild(document.getElementById("myModal"));
            }
        }

    }

    function makeSingleCourseAndSpan(co, na, bul, div, teacher, start, end, dayArr, ro) {
        /*
        make a button
        assign it an onclick to open a modal
        have the modal have form
        when they submit form, call this function 
        */
        let course = new Course(); 
        course.division = div; 
        course.code = co;
        course.name = na;
        let dArray = dayArr.split(",");
        course.days = dArray;
        course.startingTime = start
        course.endingTime = end
        course.room = ro;
        course.teacher = teacher;
        course.building = bul;
        courses[course.code] = course;
        for (let j = 0; j < course.days.length; j++) {
            var span = document.createElement("span");
            span.setAttribute("draggable", "true");
            span.addEventListener("drag", drag)
            span.id = course.code;
            span.title = course.code;
            span.name = course.code;
            span.classList.add("time-entry");
            span.classList.add("item");
            span.classList.add(course.code)
            var small = document.createElement("small");
            small.innerText = course.code;
            span.appendChild(small);
            span.style.backgroundColor = colorScheme[course.building];
            console.log(course.days[j])
            document.getElementById(course.days[j]).appendChild(span);
            span.onclick = makeModal;
        }
        fixHeight();
        fixWidth();
    }

    function makeCourses() {
        let allCourses = [];
        let courseResponse = data;
        for (let i = 0; i < data.length; i++) {
            let course = new Course(); 
            course.division = courseResponse[i].division; 
            course.code = courseResponse[i].code;
            course.name = courseResponse[i].name;
            let dArray = courseResponse[i].days.split(" ");
            course.days = dArray;
            course.startingTime = courseResponse[i].startingTime;
            course.endingTime = courseResponse[i].endingTime;
            course.courseID = courseResponse[i].courseID;
            course.room = courseResponse[i].room;
            course.teacher = courseResponse[i].teacher;
            course.building = courseResponse[i].building;
            allCourses.push(course);
            courses[course.code] = course;
        }
        let t1 = allCourses[0];
        makeSpans(allCourses);
    }

    function rebuildByBuilding(building) {
        let allCourses = [];
        let courseResponse = Object.keys(courses);
        for (let i = 0; i < data.length; i++) {
            if (courses[courseResponse[i]].building == building) {
                allCourses.push(courses[courseResponse[i]]);
            }
        }
        makeSpans(allCourses);
    }

    function rebuildByDivision(division) {  
        let allCourses = [];
        let courseResponse = Object.keys(courses);
        for (let i = 0; i < data.length; i++) {
            if (courses[courseResponse[i]].division == division) {
                allCourses.push(courses[courseResponse[i]]);
            }
        }
        makeSpans(allCourses);
        
    }

    function makeSpans(courseArray) {
        let ulArea = document.querySelector("room-timeline");
        for (let i = 0; i < courseArray.length; i++) {
                for (let j = 0; j < courseArray[i].days.length; j++) {
                    var span = document.createElement("span");
                    span.setAttribute("draggable", "true");
                    span.addEventListener("drag", drag)
                    span.id = courseArray[i].code;
                    span.title = courseArray[i].code;
                    span.name = courseArray[i].code;
                    span.classList.add("time-entry");
                    span.classList.add("item");
                    span.classList.add(courseArray[i].code)
                    var small = document.createElement("small");
                    small.innerText = courseArray[i].code;
                    span.appendChild(small);
                    span.style.backgroundColor = colorScheme[courseArray[i].building];
                    console.log(courseArray[i].days[j])
                    document.getElementById(courseArray[i].days[j]).appendChild(span);
                    span.onclick = makeModal;
                }
            }
        fixWidth();
        fixHeight();
    }

    function fixWidth() {
        let all = Object.keys(courses);
        for (let i = 0; i < all.length; i++) {
            let course = courses[all[i]];
            let el = document.getElementsByClassName(course.code);
            for (let j = 0; j < el.length; j++) {
                let t1 = moment("2013-02-08 08:00");
                let t2 = moment("2013-02-08" + " " + course.startingTime);
                let t3 = moment("2013-02-08" + " " + course.endingTime);
                let num = t2.diff(t1, 'hours', true);
                let num2 = t3.diff(t2, 'hours', true);
                let perc = (num * 4) * 2.0833333;
                el[j].style.left = Math.abs(perc) + "%";
                el[j].style.width = num2 * .13888888 * 60 + "%";
            }
        }
    }

    function makeSingleSpan(location, course) {
        var span = document.createElement("span");
        span.setAttribute("draggable", "true");
        span.addEventListener("drag", drag)
        span.id = course.code;
        span.title = course.code;
        span.name = course.code;
        span.classList.add("time-entry");
        span.classList.add("item");
        span.classList.add(course.code)
        var small = document.createElement("small");
        small.innerText = course.code;
        span.appendChild(small);
        span.style.backgroundColor = colorScheme[course.building];
        console.log(location)
        document.getElementById(location).appendChild(span);
        span.onclick = makeModal;
    }

    function makeModal() {
        let myID = this.id;
        let course = courses[myID];
        console.log(course)
        let d = document.createElement("div");
        d.id = "myModal";
        d.classList.add("modal");
        let d2 = document.createElement("div");
        d2.classList.add("modal-content");
        let head = document.createElement("div");
        head.style.backgroundColor = this.style.backgroundColor;
        head.classList.add("modal-header");
        let h2 = document.createElement("h2");
        h2.innerText = course.code + " - " + course.name;
        let con = document.createElement("div");
        con.classList.add("moral-body");
        let s = document.createElement("span");
        s.classList.add("close");
        s.onclick = function() {
            document.getElementById("myModal").style.display = "none";
            document.getElementById("container").removeChild(document.getElementById("myModal"));
          }
        let e = document.createElement("input");
        e.setAttribute("type", "time");
        e.value = course.startingTime;
        e.id = "setStart"
        let e2 = document.createElement("input");
        e2.setAttribute("type", "time");
        e2.value = course.endingTime;
        e2.id = "setEnd"
        let but = document.createElement("button");
        but.id = course.code
        but.innerText = "Sumbit Changes"
        let func = function test() {
            let myC = courses[this.id];
            let holdDays;
            if (myC.days.length > 1) {
                holdDays = myC.days;
            }
            else {
                holdDays = myC.days[0]
            }
            myC.startingTime = document.getElementById("setStart").value;
            myC.endingTime = document.getElementById("setEnd").value;
            myC.days = document.getElementById("setDays").value.split(",");
            if(myC.days != holdDays) {
                console.log(holdDays)
                let hold2;
                if (Array.isArray(holdDays)) {
                    hold2 = holdDays;
                }
                else {
                    hold2 = holdDays.split(",")
                }
                let cur = myC.days
                console.log(cur)
                console.log(hold2)
                let gLen = Math.max(hold2.length, cur.length)
                console.log(gLen)
               if (gLen == hold2.length && hold2.length != cur.length) {
                    let d = arr_diff(hold2, cur);
                    console.log(d)
                    for (let v = 0; v < d.length; v++) {
                        console.log("#" + d[v] + " #" + this.id)
                        checkForGroup(this.id);
                        let m = document.querySelectorAll("#" + d[v] + " #" + this.id);
                        m[0].parentElement.removeChild(m[0]);
                    }
                }
               else if (gLen == cur.length && hold2.length != cur.length) {
                    let d = arr_diff(hold2, cur);
                    for (let v = 0; v < d.length; v++) {
                        makeSingleSpan(d[v], courses[this.id]);
                    }
                }
               else if (hold2.length == cur.length) {
                    let d = arr_diff(hold2, cur);
                    for (let v = 0; v < d.length; v++) {
                        if(hold2.includes(d[v])) {
                            console.log("#" + d[v] + " #" + this.id)
                            let m = document.querySelectorAll("#" + d[v] + " #" + this.id);
                            m[0].parentElement.removeChild(m[0]);
                        }
                        else {
                            makeSingleSpan(d[v], courses[this.id]);
                        }
                    }
               }
            }
            courses[this.id] = myC;
            makeSpans(courses)
            fixHeight();
            fixWidth(); 
        }
        but.onclick = func;
        s.innerHTML = "&times;";
        let p = document.createElement("p");
        p.innerText = "Name: " + course.name +  " (" + course.code + ")" + "\n" +
        "Professor: " + course.teacher + "\n" + 
        "Room: " + course.building + " " + course.room + "\n" +
        "Day(s): " + course.days + "\n" + 
         "Time: " + formatDate("May 05, 2019 " + course.startingTime) + " - " + formatDate("May 05, 2019 " + course.endingTime);
        d.style.display = "block";
        let editH = document.createElement("h3")
        editH.innerText = "Edit This Class"
        let p2 = document.createElement("p");
        p2.innerText = "Starting Time";
        head.appendChild(s);
        head.appendChild(h2);
        con.appendChild(p);
        con.append(document.createElement("hr"))
        con.appendChild(editH)
        con.appendChild(p2);
        let p3 = document.createElement("p");
        p3.innerText = "Ending Time";
        con.appendChild(e)
        con.appendChild(p3)
        con.appendChild(e2);
        let tIn = document.createElement("input");
        tIn.setAttribute("type", "text");
        tIn.value = course.days
        tIn.id = "setDays"
        let inst = document.createElement("p");
        inst.innerText = "Days the class takes place on (seperate all values by a comma)."
        con.appendChild(document.createElement("br"))
        con.appendChild(inst)
        con.appendChild(tIn);
        con.appendChild(but);
        d2.appendChild(head);
        d2.appendChild(con);
        d.appendChild(d2);
        document.getElementById("container").appendChild(d);
        window.onclick = function(event) {
            if (event.target == document.getElementById("myModal")) {
                document.getElementById("myModal").style.display = "none";
                document.getElementById("container").removeChild(document.getElementById("myModal"));
            }
        }
    }

    function checkForGroup(someID) {
        let doc = document.getElementsByClassName("groupOfClasses");
        for (let i = 0; i < doc.length; i++) {
            if (doc[i].id.includes(someID)) {    
                let day = doc[i].parentElement.id;
                let ids = doc[i].id.split(" ");
                for(let x = 1; x < ids.length; x++) {
                    document.querySelectorAll("#" + day + " " + "#" + ids[x])[0].classList.remove("hide")
                }
                doc[i].parentElement.removeChild(doc[i]);
            }
        }
    }

    function arr_diff (a1, a2) {
        var a = [], diff = [];
        for (var i = 0; i < a1.length; i++) {
            a[a1[i]] = true;
        }
        for (var i = 0; i < a2.length; i++) {
            if (a[a2[i]]) {
                delete a[a2[i]];
            } else {
                a[a2[i]] = true;
            }
        }
        for (var k in a) {
            diff.push(k);
        }
        return diff;
    }

    //Gave it the ability to have a view single class... but if i edit it, it messes up the group div 
    function makeGroupModal() {
        let allIDs = this.id.split(" ");
        let d = document.createElement("div");
        d.id = "myGroupModal";
        d.classList.add("modal");
        let d2 = document.createElement("div");
        d2.classList.add("modal-content");
        let head = document.createElement("div");
        head.classList.add("modal-header");
        head.style.backgroundColor = "black";
        let h2 = document.createElement("h2");
        h2.innerText = "Classes starting at " + courses[allIDs[1]].startingTime;
        let con = document.createElement("div");
        con.classList.add("moral-body");
        let s = document.createElement("span");
        s.classList.add("close");
        s.onclick = function() {
            document.getElementById("myGroupModal").style.display = "none";
            document.getElementById("container").removeChild(document.getElementById("myGroupModal"));
        }
        s.innerHTML = "&times;";
        d.style.display = "block";
        for (let x = 1; x < allIDs.length; x++) {
            let myID = allIDs[x];
            let course = courses[myID];
            let p = document.createElement("p");
                p.innerText = "Name: " + course.name + " (" + course.code + ") \n" +
                "Professor: " + course.teacher + "\n" + 
                "Room: " + course.building + " " + course.room + "\n" +
                "Day(s): " + course.days + "\n" + 
                "Time: " + course.startingTime + " - " + course.endingTime;
            con.appendChild(p);
            let b = document.createElement("button");
            b.id = myID;
            b.onclick = makeModal;
            b.innerText = "View Single Class"
            con.appendChild(b)
            con.appendChild(document.createElement("hr"))
        }
        head.appendChild(s);
        head.appendChild(h2);
        d2.appendChild(head);
        d2.appendChild(con);
        d.appendChild(d2);
        document.getElementById("container").appendChild(d);
        window.onclick = function(event) {
            if (event.target == document.getElementById("myGroupModal")) {
                document.getElementById("myGroupModal").style.display = "none";
                document.getElementById("container").removeChild(document.getElementById("myGroupModal"));
            }
        }
    }

    function postChanges() {
        let keys = Object.keys(courses);
        let arr = [];
        for (let i = 0; i < keys.length; i++) {
            let c = courses[keys[i]];
            let d = document.getElementsByClassName(c.code);
            let function1 = function getP(el) {
                return el.parentElement.id;
            }
            let e = [...d].map(function1);
            c.days = e.join();
            courses[keys[i]] = c;
            arr.push(JSON.stringify(c));
            ///post this!!!!
        }
    }

    function fixHeight2(nodeList) {
        let len = nodeList.length;
        let newH = 100 / len;
        let str = newH.toString();
        let num = 0;
        here:
        if(len < 5 && len >= 2) {
            for (let x = 0; x < len; x++) {
                nodeList[x].style.position = "absolute";
                nodeList[x].style.height = str + "%";
                nodeList[x].style.top = num + "%";
                num += newH;
            }
        }
        else if (len >= 5) {
            let testing = nodeList[0].parentElement;
            let div = document.createElement("span");
            div.classList.add("time-entry")
            div.classList.add("item")
            div.style.backgroundColor = "black"
            div.style.left = nodeList[0].style.left;
            div.style.width = "7%";
            div.style.height = "100%"
            let small = document.createElement("small")
            for (let o = 0; o < nodeList.length; o++) {
                if(nodeList[o].id.includes(" ")) {
                    if (document.getElementById(nodeList[o].id) != null) {
                        break here;
                    }
                }
                div.id = div.id + " " + nodeList[o].id
                small.innerText = small.innerText + nodeList[o].id + ", ";
                //nodeList[o].parentElement.removeChild(nodeList[o]);
                nodeList[o].classList.add("hide")
            }
            div.appendChild(small);
            div.classList.add("groupOfClasses")
            testing.appendChild(div)
            div.onclick = makeGroupModal;
            console.log("oh no ya dont you little " + div.id)
        }
        else {
            nodeList[0].style.position = "absolute";
            nodeList[0].style.height = "100%";
            nodeList[0].style.top =  "0%";
        }
    }

    function fixHeight() {
        let items = document.querySelectorAll(".day");
        for (let i = 0; i < items.length; i++) {
            items[i].style.position = "relative";
            let children = document.querySelectorAll("#" + items[i].id + " .time-entry");
            let len = children.length;
            let newH = 100 / len;
            if (newH < 100) {let x = [...children].map(getST); 
                let x2 = [...children].map(getWidth);
                let res = [];
                for (let d = 0; d < x.length; d++) {
                    let l = x.filter(i => i === x[d]).length;
                    if (l == 1) {
                        res.push(l);
                    }
                    else if (!res.includes(l)) {
                        res.push(l);
                    }
                }
                let test1 = x.filter(onlyUnique);
                for (let q = 0; q < res.length; q++) {
                    fixHeight2([...children].filter(i => i.style.left === test1[q]))
                }
            }
            else if (children.length != 0 && newH == 100){
                children[0].style.position = "absolute";
                children[0].style.height = "100%";
                children[0].style.top =  "0%";
                }
            }
        }
          
          function dragover(e) {
              //console.log(e)
            e.preventDefault()
          }
          function dragenter(e) {
            //console.log(e)
            //console.log(e.relatedTarget)
            //curDrag = e.relatedTarget.id;
            e.preventDefault()
          }


          function drop(event) {
            
            let counts = [];
            counts[1] = 326
            for (let i = 1; i < 48; i++) {
                counts.push(counts[i-1] + 47);
            }
            goal = event.clientX;
          var closest = counts.reduce(function(prev, curr) {
            return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
          });
          console.log(closest)
            //let closest = myVals.reduce(function(prev, curr) {
             //   return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
             // });
            let l = this.children;
            let l2 = [...l].map(getEl);
            if(!l2.includes(curDrag.id)) {
                let holdN = document.querySelectorAll("#" + curDrag.id);
                for (let i = 0; i < holdN.length; i++) {
                    holdN[i].style.left = dict2[closest] + "%";
                }
                ///curDrag.style.left = dict2[closest] + "%";
                this.append(curDrag);
                courses[curDrag.id].startingTime = dict3[dict2[closest]]
                fixHeight()
            }
            else {
                if(this.id == curDrag.parentElement.id) {
                    let holdN = document.querySelectorAll("#" + curDrag.id);
                    for (let i = 0; i < holdN.length; i++) {
                        holdN[i].style.left = dict2[closest] + "%";
                    }
                    ///curDrag.style.left = dict2[closest] + "%";
                    this.append(curDrag);
                    courses[curDrag.id].startingTime = dict3[dict2[closest]]
                    fixHeight()
                }
                else {
                    alert("Can't Append Here.")
                }
            }
        }

        function getEl(el) {
            return el.id;
        }

        function onlyUnique(value, index, self) { 
            return self.indexOf(value) === index;
        }

        function getWidth(el) {
            return el.style.width;
        }
        
        function getST(el) {
            return el.style.left;
        }

        function drag(event) {
            curDrag = this;
            //var offset = $(this).offset();
            //var xPos = offset.left;
            //var yPos = offset.top;
            //console.log(xPos)
            //console.log(yPos)
        }

        function formatDate(date) {
            var d = new Date(date);
            var hh = d.getHours();
            var m = d.getMinutes();
            var dd = "AM";
            var h = hh;
            if (h >= 12) {
              h = hh - 12;
              dd = "PM";
            }
            if (h == 0) {
              h = 12;
            }
            m = m < 10 ? "0" + m : m;
          
          
            /* if you want 2 digit hours:
            h = h<10?"0"+h:h; */
          
            var pattern = new RegExp("0?" + hh + ":" + m);
          
            var replacement = h + ":" + m;
            /* if you want to add seconds
            replacement += ":"+s;  */
            replacement += " " + dd;
          
            date.replace(pattern, replacement);
            return replacement;
          }
    //}
})();