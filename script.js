window.onload = function () {
  // 获取DOM元素对象
  let loginBtn = document.querySelector(".login-btn"); // 导航栏右上角登录按钮
  let loginBox = document.querySelector(".login-box"); // 弹出的登录框
  let closeImg = document.querySelector(".closeImg"); // 登录框头部的关闭窗口按钮
  let search = document.querySelector(".search"); // 搜索容器
  let searchRes = document.querySelector(".searchRes"); // 搜索结果容器
  let carouBox = document.querySelector(".carouBox"); // 轮播图模块容器
  let background = document.querySelector(".background"); // 高斯模糊背景
  let leftBtn = document.querySelector(".leftBtn"); // 轮播图上一页按钮
  let rightBtn = document.querySelector(".rightBtn"); // 轮播图下一页按钮
  let img = document.querySelector("img.img"); // 轮播图图片
  let btnsBox = document.querySelector(".btns-box"); // 轮播图小圆点的容器
  let playlistImgDiv = document.querySelectorAll(".playlistImgDiv");
  let playlistImgs = document.querySelectorAll(".playlistImgs");
  let playlistPlayCountSpan = document.querySelectorAll(".playCount"); // 播放数
  let playlistDesc = document.querySelectorAll(".playlistDesc");
  let scrollLeft = document.querySelector(".scrollLeft"); // 左滚动翻页按钮
  let scrollRight = document.querySelector(".scrollRight"); // 右滚动翻页按钮
  let showContent = document.querySelector(".showContent"); // 无缝滚动所有内容容器
  let loginBtnRed = document.querySelector(".login-btn-red"); // 页面主体部分的红色登录按钮
  let loginBoxHead = document.querySelector(".loginBoxHead"); // 登录框头部
  let loginBtnBox = document.querySelector("div.login-btn-mod");
  let dropDown = $("div.drop-down"); // 下拉框的容器
  let avatar = document.querySelector("img.avatar"); // 登陆后显示的头像
  let phone = document.querySelector("#phone"); // 手机号输入框
  let captcha = document.querySelector("input#captcha");
  let password = document.querySelector("#password"); // 密码输入框
  let loginBtnBlue = document.querySelector("a.login-button-blue"); // 登录框蓝色登录按钮
  let auto = document.querySelector("input#auto"); // 自动登录复选框
  let errors = document.querySelector("div.errors"); // 密码或验证码错误的容器
  let errorsDesc = document.querySelector("span.errors-desc"); // 密码或验证码错误的描述
  let audio = document.querySelector("audio.audio"); // 播放器模块
  let music = document.querySelector("source.music"); // 音乐源
  let playerName = document.querySelector("span.player-name"); // 播放器显示歌名
  let playerArtist = document.querySelector("span.player-artist"); // 播放器显示歌手名
  let playerMod = document.querySelector("div.player-mod"); // 播放器模块(固定定位)
  let player = document.querySelector("div.player"); // 播放器容器(绝对定位，需要移动)
  let lock = document.querySelector("a.lock"); // 记录是否固定的flag变量
  let isLocked = false;
  // 保存异步请求结果的数组
  let imgList = [];
  // 保存动态生成小圆点对象的数组
  let btns = [];
  // 定义全局索引，用于同步轮播图、背景图和按钮交互信息
  let index = 0;
  // 定义全局定时器变量，用于定时切换轮播图
  let interval;
  // 定义isMoving变量，保存group节点移动状态
  let isMoving = false;
  // 创建Cookie对象
  let Cookie = {
    setCookie: function (key, value, seconds) {
      let time = new Date();
      time.setSeconds(time.getSeconds() + seconds);
      document.cookie = `${key}=${value}; expires=${time.toUTCString()}`;
    },
    getCookie: function getCookie(key) {
      let name = key + "=";
      let decodedCookie = decodeURIComponent(document.cookie);
      let ca = decodedCookie.split(";");
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    },
    removeCookie: function (key) {
      this.setCookie(key, "", -1);
    },
  };

  // 初始化页面，若有cookie则不需要登录
  let loginInfo = document.querySelector("div.login-info");
  let userProfile = document.querySelector("div.user-profile");
  if (Cookie.getCookie("userName")) {
    loginBtn.style.display = "none"; // 隐藏登录按钮
    avatar.style.display = "block"; // 显示头像
    loginBtnBox.addEventListener("mouseenter", enter); // 鼠标进入事件显示下拉框
    loginBtnBox.addEventListener("mouseleave", leave); // 鼠标移出事件隐藏下拉框
  }
  // 若有cookie，则从cookie读取数据
  let profile = Cookie.getCookie("profile");
  let profileAvatar = document.querySelector("img.profile-avatar");
  let profileUsername = document.querySelector("a.profile-username");
  let level = document.querySelector("span.level");
  let eventCount = document.querySelector("li.event-count");
  let follows = document.querySelector("li.follows");
  let followeds = document.querySelector("li.followeds");
  function loginFillInfo(profile) {
    if (profile) {
      profileObj = JSON.parse(profile);
      profileAvatar.src = profileObj.avatarUrl;
      profileUsername.innerHTML = profileObj.nickname;
      eventCount.innerHTML = "动态 : " + profileObj.eventCount;
      follows.innerHTML = "关注 : " + profileObj.follows;
      followeds.innerHTML = "粉丝 : " + profileObj.followeds;
      loginInfo.style.display = "none"; // 隐藏登录信息框
      userProfile.style.display = "block"; // 显示用户详情框
      $.get({
        url: `https://muise-git-master-329639010.vercel.app/user/detail?uid=${Cookie.getCookie(
          "userId"
        )}`,
        success: function (data) {
          level.innerHTML = "等级: " + data.level;
        },
      });
    }
  }
  loginFillInfo(profile);

  // 导航栏的登录按钮点击事件，点击后打开登录框
  loginBtn.addEventListener("click", function (e) {
    e.preventDefault();
    loginBox.style.display = "block";
  });

  // 红色登录按钮点击事件，点击后打开登录框
  loginBtnRed.addEventListener("click", function (e) {
    e.preventDefault();
    loginBox.style.display = "block";
  });

  // 登录框关闭按钮点击事件，点击后关闭登录框
  closeImg.addEventListener("click", function () {
    loginBox.style.display = "none";
    errors.style.display = "none"; // 隐藏错误提示
    phone.value = ""; // 关闭后清除输入过的信息
    captcha.value = "";
    password.value = "";
    isCaptcha = true; // 关闭后回复默认的短信登录方式
    passwordMod.style.display = "none";
    captchaMod.style.display = "block";
    // 恢复登录框位置
    loginBox.style.left = 696 + "px";
    loginBox.style.top = 312 + "px";
  });

  // e.clientX 鼠标在文档的横向位置
  // e.offsetX 鼠标在容器内的横向位置
  // div.offsetLeft 容器左边在父容器内的横向位置

  // 登录框拖动事件
  loginBoxHead.addEventListener("mousedown", function (Edown) {
    function move(Emove) {
      if (loginBox.offsetLeft > 0) {
        loginBox.style.left = Emove.clientX - Edown.offsetX + "px";
        // loginBox.style.top = Emove.clientY - Edown.offsetY + "px";
      } else {
        loginBox.style.left = "0px";
        if (Emove.clientX - pos > 0) {
          pos = Emove.offsetX;
          console.log(pos);
        }
      }
    }
    document.addEventListener("mousemove", move);
    loginBoxHead.addEventListener("mouseup", function () {
      document.removeEventListener("mousemove", move);
    });
  });

  // 测试jQuery的Ajax
  $(".test").click(function () {
    $.get({
      url: "https://muise-git-master-329639010.vercel.app/user/detail?uid=6393633940",
      success: function (data) {
        console.log(data);
      },
    });
  });

  // 密码登录AJAX
  function pwdLoginAjax() {
    let xhr = new XMLHttpRequest();
    xhr.open(
      "post",
      `https://muise-git-master-329639010.vercel.app/login/cellphone`
    );
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(
      `phone=${phone.value}&password=${
        password.value
      }&timestamp=${new Date().getTime()}`
    );
    xhr.addEventListener("readystatechange", function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let Obj = JSON.parse(xhr.response);
        console.log("密码登录", Obj);
        if (Obj.code === 200) {
          Cookie.setCookie("userName", Obj.profile.nickname, 3600); // 登陆成功设置cookies
          Cookie.setCookie("userId", Obj.profile.userId, 3600); // 登陆成功设置cookies
          Cookie.setCookie("profile", JSON.stringify(Obj.profile), 3600); // 用cookie保存登陆成功返回的对象
          loginFillInfo(JSON.stringify(Obj.profile)); // 登录后填充信息
          errors.style.display = "none";
          if (auto.checked === true) {
            window.localStorage.setItem("userName", Obj.profile.nickname);
          }
          loginBox.style.display = "none"; // 登录成功，关闭登录框
          loginBtn.style.display = "none"; // 隐藏登录按钮
          avatar.style.display = "block"; // 显示头像
          loginBtnBox.addEventListener("mouseenter", enter); // 鼠标进入事件显示下拉框
          loginBtnBox.addEventListener("mouseleave", leave); // 鼠标移出事件隐藏下拉框
        } else if (Obj.code === 502 && Obj.msg === "密码错误") {
          errors.style.display = "block";
          errorsDesc.innerHTML = "手机号或密码错误";
        }
      }
    });
  }
  function pwdLoginClick(e) {
    e.preventDefault();
    pwdLoginAjax();
  }

  // 发送验证码AJAX
  let getCaptcha = document.querySelector("a.get-captcha");
  getCaptcha.addEventListener("click", function (e) {
    e.preventDefault();
    let xhr = new XMLHttpRequest();
    xhr.open(
      "get",
      `https://muise-git-master-329639010.vercel.app/captcha/sent?phone=${
        phone.value
      }&timestamp=${new Date().getTime()}`
    );
    xhr.send();
  });

  // 验证码登录AJAX
  function captchaLoginAjax() {
    let xhr = new XMLHttpRequest();
    xhr.open(
      "post",
      `https://muise-git-master-329639010.vercel.app/login/cellphone`
    );
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(
      `phone=${phone.value}&captcha=${
        captcha.value
      }&timestamp=${new Date().getTime()}`
    );
    xhr.addEventListener("readystatechange", function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let Obj = JSON.parse(xhr.response);
        console.log("短信登录", Obj);
        if (Obj.code === 200) {
          Cookie.setCookie("userName", Obj.profile.nickname, 3600); // 登陆成功设置cookies
          Cookie.setCookie("userId", Obj.profile.userId, 3600); // 登陆成功设置cookies
          Cookie.setCookie("profile", JSON.stringify(Obj.profile), 3600); // 用cookie保存登陆成功返回的对象
          loginFillInfo(JSON.stringify(Obj.profile)); // 登录后填充信息
          errors.style.display = "none";
          if (auto.checked === true) {
            window.localStorage.setItem("userName", Obj.profile.nickname);
          }
          loginBox.style.display = "none"; // 登录成功，关闭登录框
          loginBtn.style.display = "none"; // 隐藏登录按钮
          avatar.style.display = "block"; // 显示头像
          loginBtnBox.addEventListener("mouseenter", enter); // 鼠标进入事件显示下拉框
          loginBtnBox.addEventListener("mouseleave", leave); // 鼠标移出事件隐藏下拉框
        }
      } else {
        errors.style.display = "block";
        errorsDesc.innerHTML = "验证码错误";
      }
    });
  }
  loginBtnBlue.addEventListener("click", captchaLoginClick);
  function captchaLoginClick(e) {
    e.preventDefault();
    captchaLoginAjax();
  }

  // 切换登录方式的点击事件
  let isCaptcha = true; // 当前使用的登录方式
  let chooseLoginMethod = document.querySelector("a.choose-login-method");
  let passwordMod = document.querySelector("div.password-mod");
  let captchaMod = document.querySelector("div.captcha-mod");
  chooseLoginMethod.addEventListener("click", function (e) {
    e.preventDefault();
    // 点击后显示的内容
    if (isCaptcha === true) {
      // 显示密码登录
      passwordMod.style.display = "block";
      captchaMod.style.display = "none";
      loginBtnBlue.removeEventListener("click", captchaLoginClick); // 移除短信登录
      loginBtnBlue.addEventListener("click", pwdLoginClick); // 添加密码登录
      chooseLoginMethod.innerHTML = "短信登录";
      isCaptcha = false;
    } else {
      // 显示短信登录
      passwordMod.style.display = "none";
      captchaMod.style.display = "block";
      loginBtnBlue.removeEventListener("click", pwdLoginClick); // 移除密码登录
      loginBtnBlue.addEventListener("click", captchaLoginClick); // 添加短信登录
      chooseLoginMethod.innerHTML = "密码登录";
      isCaptcha = true;
    }
  });

  // 登录成功后头像下拉列表函数
  function enter() {
    dropDown.show(); // 鼠标进入，显示下拉框
  }
  function leave() {
    // dropDown.style.display = "none";
    dropDown.hide(); // 鼠标移出，隐藏下拉框
  }

  // 退出登录AJAX
  let logOut = document.querySelector("a.log-out");
  function logOutAjax() {
    let xhr = new XMLHttpRequest();
    xhr.open("get", `https://muise-git-master-329639010.vercel.app/logout`);
    xhr.send();
    xhr.addEventListener("readystatechange", function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let Obj = JSON.parse(xhr.response);
        console.log("退出登录", Obj);
        Cookie.removeCookie("userName"); // 退出后清除cookie
        Cookie.removeCookie("userId"); // 登陆成功设置cookies
        Cookie.removeCookie("profile"); // 退出后清除登录信息
        loginInfo.style.display = "block"; // 显示登录信息框
        userProfile.style.display = "none"; // 隐藏用户详情框
        loginBtn.style.display = "block"; // 显示登录按钮
        avatar.style.display = "none"; // 隐藏头像
        loginBtnBox.removeEventListener("mouseenter", enter); // 移除，鼠标进入事件显示下拉框
        loginBtnBox.removeEventListener("mouseleave", leave); // 移除，鼠标移出事件隐藏下拉框
        dropDown.hide(); // 隐藏登录下拉框
        phone.value = ""; // 退出后清除输入过的信息
        captcha.value = "";
        password.value = "";
        isCaptcha = true; // 退出后回复默认的短信登录方式
        passwordMod.style.display = "none";
        captchaMod.style.display = "block";
        errors.style.display = "none"; // 隐藏错误提示
      }
    });
  }
  logOut.addEventListener("click", function (e) {
    e.preventDefault();
    logOutAjax();
  });

  // 搜索框键盘松开事件
  search.addEventListener("keyup", function () {
    // 若搜索框无内容，则隐藏搜索结果，否则显示
    if (search.value.length === 0) {
      searchRes.style.display = "none";
    } else {
      searchRes.style.display = "block";
    }
    let xhr = new XMLHttpRequest();
    xhr.open(
      "get",
      `https://muise-git-master-329639010.vercel.app/search?keywords=${
        search.value
      }&timestamp=${new Date().getTime()}`
    );
    xhr.send();
    xhr.addEventListener("readystatechange", function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let Obj = JSON.parse(xhr.response);
        searchRes.innerHTML = "";
        for (let i = 0; i < 3; i++) {
          let str =
            Obj.result.songs[i].name +
            "-" +
            Obj.result.songs[i].artists[0].name;
          let elem = document.createElement("div");
          elem.innerText = str;
          searchRes.appendChild(elem);
        }
      }
    });
  });
  // 搜索框聚焦事件，聚焦时显示搜索结果
  search.addEventListener("focus", function () {
    if (search.value.length !== 0) {
      searchRes.style.display = "block";
    }
  });
  // 搜索框失焦事件，失焦时隐藏搜索内容
  search.addEventListener("blur", function () {
    searchRes.style.display = "none";
  });

  // 轮播图模块的异步请求
  function carouselAjax() {
    let xhr = new XMLHttpRequest();
    xhr.open(
      "get",
      `https://muise-git-master-329639010.vercel.app/banner?type=0&timestamp=${new Date().getTime()}`
    );
    xhr.send();
    xhr.addEventListener("readystatechange", function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let Obj = JSON.parse(xhr.response);
        for (let i = 0; i < Obj.banners.length; i++) {
          imgList[i] = Obj.banners[i].imageUrl;
          // 动态生成小圆点，因为有时数量为9，有时数量为10
          let elem = document.createElement("a");
          elem.className = "btns";
          btns.push(elem);
          btnsBox.appendChild(elem);
        }
        // 为小圆点添加样式
        for (let i = 0; i < btns.length; i++) {
          btns[i].index = i;
          btns[i].addEventListener("click", function (e) {
            e.preventDefault();
            index = e.target.index;
            clearBtns();
            e.target.style.backgroundPositionX = "23px";
            img.src = imgList[e.target.index];
            background.style.background = `url(${imgList[e.target.index]})`;
          });
        }
        // 异步请求成功后，显示第一张图片
        img.src = `${imgList[index]}`;
        background.style.background = `url(${imgList[0]})`;
        btns[0].style.backgroundPositionX = "23px";

        clearInterval(interval);

        setTimeout(() => {
          interval = setInterval(carouselNext, 5000); // 五秒切换一次
          // 轮播图事件：鼠标进入停止，鼠标离开继续
          carouBox.addEventListener("mouseenter", function () {
            clearInterval(interval);
          });
          carouBox.addEventListener("mouseleave", function () {
            interval = setInterval(carouselNext, 5000);
          });
        }, 5000);

        // 轮播图自动翻页的函数
        let timeoutID;
        function carouselNext() {
          clearBtns();
          clearTimeout(timeoutID);
          index = index === imgList.length - 1 ? 0 : index + 1;
          img.style.opacity = "0";
          timeoutID = setTimeout(function () {
            img.style.opacity = "1";
            img.src = imgList[index];
            background.style.background = `url(${imgList[index]})`;
            btns[index].style.backgroundPositionX = "23px";
          }, 900);
        }
      }
    });
  }
  carouselAjax();

  // 轮播图上一页按钮点击事件
  leftBtn.addEventListener("click", function () {
    index = index === 0 ? imgList.length - 1 : index - 1;
    img.src = `${imgList[index]}`;
    background.style.background = `url(${imgList[index]})`;
    clearBtns();
    btns[index].style.backgroundPositionX = "23px";
  });

  // 轮播图下一页按钮点击事件
  rightBtn.addEventListener("click", function () {
    index = index === imgList.length - 1 ? 0 : index + 1;
    img.src = `${imgList[index]}`;
    background.style.background = `url(${imgList[index]})`;
    clearBtns();
    btns[index].style.backgroundPositionX = "23px";
  });

  // 重置所有小圆点样式的函数
  function clearBtns() {
    btns.forEach((item) => {
      item.style.backgroundPositionX = "3px";
    });
  }

  // 获取歌单的异步请求
  function playlistAjax(playlistID) {
    let xhr = new XMLHttpRequest();
    xhr.open(
      "get",
      `https://muise-git-master-329639010.vercel.app/playlist/detail?id=${playlistID}`
    );
    xhr.send();
    xhr.addEventListener("readystatechange", function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let Obj = JSON.parse(xhr.response);
        music.src = `https://music.163.com/song/media/outer/url?id=${Obj.playlist.tracks[0].id}.mp3`;
        audio.load();
        audio.play();
        playerName.innerHTML = Obj.playlist.tracks[0].name;
        playerArtist.innerHTML = Obj.playlist.tracks[0].ar[0].name;
        if (isLocked === false) {
          player.style.bottom = 0 + "px";
          setTimeout(() => {
            player.style.bottom = -45 + "px";
          }, 3000);
        }
      }
    });
  }

  // 热门推荐的异步请求，用于获取歌单封面图片、歌单播放信息和歌单描述
  function playlistRecomAjax() {
    let xhr = new XMLHttpRequest();
    xhr.open(
      "get",
      `https://muise-git-master-329639010.vercel.app/personalized?limit=8&timestamp=${new Date().getTime()}`
    );
    xhr.send();
    xhr.addEventListener("readystatechange", function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let result = JSON.parse(xhr.response).result;
        let playAudioBtns = document.querySelectorAll("a.playAudio");
        for (let i = 0; i < playlistImgDiv.length; i++) {
          playlistImgs[i].src = result[i].picUrl;
          playlistPlayCountSpan[i].innerHTML = `${parseInt(
            result[i].playCount / 10000
          )}万`;
          playlistDesc[i].innerHTML = result[i].name;
          playAudioBtns[i].addEventListener("click", function (e) {
            e.preventDefault();
            playlistAjax(result[i].id);
          });
        }
      }
    });
  }
  playlistRecomAjax();

  // 获取专辑信息的异步请求函数
  function albumAjax(albumID) {
    let xhr = new XMLHttpRequest();
    xhr.open(
      "get",
      `https://muise-git-master-329639010.vercel.app/album?id=${albumID}`
    );
    xhr.send();
    xhr.addEventListener("readystatechange", function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let Obj = JSON.parse(xhr.response);
        music.src = `https://music.163.com/song/media/outer/url?id=${Obj.songs[0].id}.mp3`;
        audio.load();
        audio.play();
        playerName.innerHTML = Obj.songs[0].name;
        playerArtist.innerHTML = Obj.songs[0].ar[0].name;
        if (isLocked === false) {
          player.style.bottom = 0 + "px";
          setTimeout(() => {
            player.style.bottom = -45 + "px";
          }, 3000);
        }
      }
    });
  }

  // 新碟上架的异步请求
  function newAjax() {
    let xhr = new XMLHttpRequest();
    xhr.open(
      "get",
      `https://muise-git-master-329639010.vercel.app/top/album?limit=5&offset=0&area=ZH&type=hot&year=2022&month=1&timestamp=${new Date().getTime()}`
    );
    xhr.send();
    xhr.addEventListener("readystatechange", function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let monthData = JSON.parse(xhr.response).monthData;
        let g1PlayBtns = document.querySelectorAll("#g1 a.play-icon-btn");
        let g2PlayBtns = document.querySelectorAll("#g2 a.play-icon-btn");
        let g3PlayBtns = document.querySelectorAll("#g3 a.play-icon-btn");
        let g4PlayBtns = document.querySelectorAll("#g4 a.play-icon-btn");
        // 第1、3组，下标5-9
        for (let i = 5; i < 10; i++) {
          document.querySelectorAll("#g1 .coverImg")[i - 5].src =
            monthData[i].picUrl;
          document.querySelectorAll("#g1 .songName")[i - 5].innerHTML =
            monthData[i].name;
          document.querySelectorAll("#g1 .songArtist")[i - 5].innerHTML =
            monthData[i].artists[0].name;

          document.querySelectorAll("#g3 .coverImg")[i - 5].src =
            monthData[i].picUrl;
          document.querySelectorAll("#g3 .songName")[i - 5].innerHTML =
            monthData[i].name;
          document.querySelectorAll("#g3 .songArtist")[i - 5].innerHTML =
            monthData[i].artists[0].name;

          g1PlayBtns[i - 5].addEventListener("click", function (e) {
            e.preventDefault();
            albumAjax(monthData[i].id);
          });

          g3PlayBtns[i - 5].addEventListener("click", function (e) {
            e.preventDefault();
            albumAjax(monthData[i].id);
          });
        }
        // 第2、4组，下标0-4
        for (let i = 0; i < 5; i++) {
          document.querySelectorAll("#g2 .coverImg")[i].src =
            monthData[i].picUrl;
          document.querySelectorAll("#g2 .songName")[i].innerHTML =
            monthData[i].name;
          document.querySelectorAll("#g2 .songArtist")[i].innerHTML =
            monthData[i].artists[0].name;

          document.querySelectorAll("#g4 .coverImg")[i].src =
            monthData[i].picUrl;
          document.querySelectorAll("#g4 .songName")[i].innerHTML =
            monthData[i].name;
          document.querySelectorAll("#g4 .songArtist")[i].innerHTML =
            monthData[i].artists[0].name;

          g2PlayBtns[i].addEventListener("click", function (e) {
            e.preventDefault();
            albumAjax(monthData[i].id);
          });

          g4PlayBtns[i].addEventListener("click", function (e) {
            e.preventDefault();
            albumAjax(monthData[i].id);
          });
        }
      }
    });
  }
  newAjax();

  // 右按钮点击事件，点击后向左无缝滚动，模拟向左翻动
  scrollRight.addEventListener("click", function (e) {
    e.preventDefault();
    if (isMoving === false) {
      isMoving = true;
      // 移动第2、3、4个节点
      document.querySelector("#g2").style.left =
        document.querySelector("#g2").offsetLeft - 634 + "px";
      document.querySelector("#g3").style.left =
        document.querySelector("#g3").offsetLeft - 634 + "px";
      document.querySelector("#g4").style.left =
        document.querySelector("#g4").offsetLeft - 634 + "px";
      let temp = document.querySelector("#g1"); //保存第1个节点
      showContent.removeChild(document.querySelector("#g1")); //移除第1个节点
      showContent.appendChild(temp); //将第1个节点添加到队列末尾
      showContent.children[3].style.left = "1268px"; //调整末尾节点的样式
      // 修改id属性
      for (let i = 0; i < showContent.children.length; i++) {
        showContent.children[i].setAttribute("id", `g${i + 1}`);
      }
      setTimeout(() => {
        isMoving = false;
      }, 1000);
    }
  });
  // 左按钮点击事件，点击后向右无缝滚动，模拟向右翻动
  scrollLeft.addEventListener("click", function (e) {
    e.preventDefault();
    if (isMoving === false) {
      isMoving = true;
      // 移动第1、2、3个节点
      document.querySelector("#g1").style.left =
        document.querySelector("#g1").offsetLeft + 634 + "px";
      document.querySelector("#g2").style.left =
        document.querySelector("#g2").offsetLeft + 634 + "px";
      document.querySelector("#g3").style.left =
        document.querySelector("#g3").offsetLeft + 634 + "px";
      let temp = document.querySelector("#g4"); //保存第4个节点
      showContent.removeChild(document.querySelector("#g4")); //移除第4个节点
      showContent.insertBefore(temp, document.querySelector("#g1")); //将第4个节点添加到第1个节点之前
      showContent.children[0].style.left = "-634px"; //调整新添加节点的位置到队列开头
      // 修改id属性
      for (let i = 0; i < showContent.children.length; i++) {
        showContent.children[i].setAttribute("id", `g${i + 1}`);
      }
      setTimeout(() => {
        isMoving = false;
      }, 1000);
    }
  });

  let billCoverImgs = document.querySelectorAll("div.bill-cover img");

  // 榜单
  // 飙升榜的异步请求
  function risingBillAjax() {
    let xhr = new XMLHttpRequest();
    xhr.open(
      "get",
      `https://muise-git-master-329639010.vercel.app/playlist/detail?id=19723756&timestamp=${new Date().getTime()}`
    );
    xhr.send();
    xhr.addEventListener("readystatechange", function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let Obj = JSON.parse(xhr.response);
        billCoverImgs[0].src = Obj.playlist.coverImgUrl;
        let risingBillSongs = document.querySelectorAll(
          "div.rising-bill a.songs"
        );
        let risingBillPlayBtns = document.querySelectorAll(
          "div.rising-bill a.bill-play"
        ); // 获取播放按钮
        for (let i = 0; i < risingBillSongs.length; i++) {
          risingBillSongs[i].innerHTML = Obj.playlist.tracks[i].name;
          risingBillSongs[
            i
          ].href = `https://music.163.com/#/song?id=${Obj.playlist.tracks[i].id}`;
          risingBillSongs[i].title = Obj.playlist.tracks[i].name;
          risingBillPlayBtns[i].addEventListener("click", function (e) {
            e.preventDefault();
            music.src = `https://music.163.com/song/media/outer/url?id=${Obj.playlist.tracks[i].id}.mp3`;
            audio.load();
            audio.play();
            playerName.innerHTML = Obj.playlist.tracks[i].name;
            playerArtist.innerHTML = Obj.playlist.tracks[i].ar[0].name;
            if (isLocked === false) {
              player.style.bottom = 0 + "px";
              setTimeout(() => {
                player.style.bottom = -45 + "px";
              }, 3000);
            }
          });
        }
      }
    });
  }
  risingBillAjax();
  // 新歌榜的异步请求
  function newBillAjax() {
    let xhr = new XMLHttpRequest();
    xhr.open(
      "get",
      `https://muise-git-master-329639010.vercel.app/playlist/detail?id=3779629&timestamp=${new Date().getTime()}`
    );
    xhr.send();
    xhr.addEventListener("readystatechange", function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let Obj = JSON.parse(xhr.response);
        billCoverImgs[1].src = Obj.playlist.coverImgUrl;
        let newBillSongs = document.querySelectorAll("div.new-bill a.songs");
        let newBillPlayBtns = document.querySelectorAll(
          "div.new-bill a.bill-play"
        ); // 获取播放按钮
        for (let i = 0; i < newBillSongs.length; i++) {
          newBillSongs[i].innerHTML = Obj.playlist.tracks[i].name;
          newBillSongs[
            i
          ].href = `https://music.163.com/#/song?id=${Obj.playlist.tracks[i].id}`;
          newBillSongs[i].title = Obj.playlist.tracks[i].name;
          newBillPlayBtns[i].addEventListener("click", function (e) {
            e.preventDefault();
            music.src = `https://music.163.com/song/media/outer/url?id=${Obj.playlist.tracks[i].id}.mp3`;
            audio.load();
            audio.play();
            playerName.innerHTML = Obj.playlist.tracks[i].name;
            playerArtist.innerHTML = Obj.playlist.tracks[i].ar[0].name;
            if (isLocked === false) {
              player.style.bottom = 0 + "px";
              setTimeout(() => {
                player.style.bottom = -45 + "px";
              }, 3000);
            }
          });
        }
      }
    });
  }
  newBillAjax();
  // 原创榜的异步请求
  function originalBillAjax() {
    let xhr = new XMLHttpRequest();
    xhr.open(
      "get",
      `https://muise-git-master-329639010.vercel.app/playlist/detail?id=2884035&timestamp=${new Date().getTime()}`
    );
    xhr.send();
    xhr.addEventListener("readystatechange", function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let Obj = JSON.parse(xhr.response);
        billCoverImgs[2].src = Obj.playlist.coverImgUrl;
        let originalBillSongs = document.querySelectorAll(
          "div.original-bill a.songs"
        );
        let originalBillPlayBtns = document.querySelectorAll(
          "div.original-bill a.bill-play"
        ); // 获取播放按钮
        for (let i = 0; i < originalBillSongs.length; i++) {
          originalBillSongs[i].innerHTML = Obj.playlist.tracks[i].name;
          originalBillSongs[
            i
          ].href = `https://music.163.com/#/song?id=${Obj.playlist.tracks[i].id}`;
          originalBillSongs[i].title = Obj.playlist.tracks[i].name;
          originalBillPlayBtns[i].addEventListener("click", function (e) {
            e.preventDefault();
            music.src = `https://music.163.com/song/media/outer/url?id=${Obj.playlist.tracks[i].id}.mp3`;
            audio.load();
            audio.play();
            playerName.innerHTML = Obj.playlist.tracks[i].name;
            playerArtist.innerHTML = Obj.playlist.tracks[i].ar[0].name;
            if (isLocked === false) {
              player.style.bottom = 0 + "px";
              setTimeout(() => {
                player.style.bottom = -45 + "px";
              }, 3000);
            }
          });
        }
      }
    });
  }
  originalBillAjax();

  // 为li添加鼠标移入、移出事件，触发后显示、隐藏小组件
  let risingBillLis = document.querySelectorAll("div.rising-bill ol li");
  let newBillLis = document.querySelectorAll("div.new-bill ol li");
  let originalBillLis = document.querySelectorAll("div.original-bill ol li");
  for (let i = 0; i < risingBillLis.length; i++) {
    risingBillLis[i].addEventListener("mouseenter", function (e) {
      e.target.lastElementChild.style.display = "block";
      e.target.children[1].classList.add("short");
    });
    risingBillLis[i].addEventListener("mouseleave", function (e) {
      e.target.lastElementChild.style.display = "none";
      e.target.children[1].classList.remove("short");
    });
    newBillLis[i].addEventListener("mouseenter", function (e) {
      e.target.lastElementChild.style.display = "block";
      e.target.children[1].classList.add("short");
    });
    newBillLis[i].addEventListener("mouseleave", function (e) {
      e.target.lastElementChild.style.display = "none";
      e.target.children[1].classList.remove("short");
    });
    originalBillLis[i].addEventListener("mouseenter", function (e) {
      e.target.lastElementChild.style.display = "block";
      e.target.children[1].classList.add("short");
    });
    originalBillLis[i].addEventListener("mouseleave", function (e) {
      e.target.lastElementChild.style.display = "none";
      e.target.children[1].classList.remove("short");
    });
  }

  // 获取入驻歌手的异步请求
  let singerImgs = document.querySelectorAll("div.singer-head img");
  let singerNames = document.querySelectorAll("span.singer-name");
  function singersAjax() {
    let xhr = new XMLHttpRequest();
    // xhr.open("get", `https://muise-git-master-329639010.vercel.app/toplist/artist&timestamp=${new Date().getTime()}`);
    xhr.open(
      "get",
      `https://muise-git-master-329639010.vercel.app/artist/list?timestamp=${new Date().getTime()}`
    );
    xhr.send();
    xhr.addEventListener("readystatechange", function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let Obj = JSON.parse(xhr.response);
        for (let i = 0; i < singerImgs.length; i++) {
          singerImgs[i].src = Obj.artists[i].picUrl;
          singerNames[i].innerHTML = Obj.artists[i].name;
        }
      }
    });
  }
  singersAjax();

  // 热门主播
  let djImgs = document.querySelectorAll("a.dj-head img");
  let djNames = document.querySelectorAll("a.dj-name");
  let djDescs = document.querySelectorAll("p.dj-desc");
  function djAjax() {
    let xhr = new XMLHttpRequest();
    xhr.open(
      "get",
      `https://muise-git-master-329639010.vercel.app/dj/hot?timestamp=${new Date().getTime()}`
    );
    xhr.send();
    xhr.addEventListener("readystatechange", function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let Obj = JSON.parse(xhr.response);
        for (let i = 0; i < djImgs.length; i++) {
          djImgs[i].src = Obj.djRadios[i].picUrl;
          djNames[i].innerHTML = Obj.djRadios[i].name;
          djDescs[i].innerHTML = Obj.djRadios[i].rcmdtext;
        }
      }
    });
  }
  djAjax();

  // 回到顶部按钮
  let backTopButton = document.querySelector(".back-top");
  backTopButton.addEventListener("click", (e) => {
    e.preventDefault();
    document.body.scrollIntoView();
  });
  document.addEventListener("scroll", () => {
    if (document.documentElement.scrollTop === 0) {
      backTopButton.classList.add("hidden");
    } else {
      backTopButton.classList.remove("hidden");
    }
  });

  // 播放器模块
  // 打开页面后若未选择固定，则5秒后隐藏播放器
  if (isLocked === false) {
    player.style.bottom = 0 + "px";
    setTimeout(() => {
      player.style.bottom = -45 + "px";
    }, 5000);
  }
  // 移入显示，移出隐藏的函数和相应的事件
  function playerEnter() {
    player.style.bottom = 0 + "px";
  }
  function playerLeave() {
    player.style.bottom = -45 + "px";
  }
  playerMod.addEventListener("mouseenter", playerEnter);
  playerMod.addEventListener("mouseleave", playerLeave);
  // 解锁leave background-position: -80px -380px;
  // 解锁enter background-position: -80px -400px;
  // 锁定leave background-position: -100px -380px;
  // 锁定enter background-position: -100px -400px;
  // 固定/取消固定功能
  function unlockedEnter() {
    lock.style = "background-position: -80px -400px;";
  }
  function unlockedLeave() {
    lock.style = "background-position: -80px -380px;";
  }
  function lockedEnter() {
    lock.style = "background-position: -100px -400px;";
  }
  function lockedLeave() {
    lock.style = "background-position: -100px -380px;";
  }
  lock.addEventListener("mouseenter", unlockedEnter);
  lock.addEventListener("mouseleave", unlockedLeave);
  lock.addEventListener("click", function (e) {
    e.preventDefault();
    if (isLocked === false) {
      // 点击后锁定
      isLocked = true;
      playerMod.removeEventListener("mouseleave", playerLeave);
      lock.style = "background-position: -100px -400px;";
      lock.removeEventListener("mouseenter", unlockedEnter);
      lock.removeEventListener("mouseleave", unlockedLeave);
      lock.addEventListener("mouseenter", lockedEnter);
      lock.addEventListener("mouseleave", lockedLeave);
    } else {
      // 点击后解锁
      isLocked = false;
      playerMod.addEventListener("mouseleave", playerLeave);
      lock.style = "background-position: -80px -400px;";
      lock.removeEventListener("mouseenter", lockedEnter);
      lock.removeEventListener("mouseleave", lockedLeave);
      lock.addEventListener("mouseenter", unlockedEnter);
      lock.addEventListener("mouseleave", unlockedLeave);
    }
  });
};
