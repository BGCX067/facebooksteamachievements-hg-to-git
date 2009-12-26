﻿/// <reference path="js/jquery-vsdoc.js" />
/// <reference path="js/json2.js" />
/// <reference path="js/FeatureLoader.js" />
var _serviceBase = "Services/Achievement.svc/";
var _log = false;

function getGames()
{
    var ondone = function(data)
    {
        var games = data;
        var gamesHtml = "<option value=''>[select a game]</option>";

        for (var i = 0; i < games.length; i++)
        {
            var a = games[i];
            gamesHtml += "<option value='" + a.Id + "'>" + a.Name + "</option>";
        }

        log(gamesHtml);
        $("#gamesSelect").html(gamesHtml);
    };

    callAjax("GetGames", {}, ondone);
}

function getAchievements()
{
    var steamUserId = $("#steamIdTextBox").val();
    var gameId = $("#gamesSelect").val();

    if (gameId == null || gameId == "")
    {
        return false;
    }

    var $achievements = $("#achievementsDiv");
    $achievements.text("loading ...");

    var ondone = function(data)
    {
        var achievementsHtml = "";

        for (var i = 0; i < data.length; i++)
        {
            var a = data[i];
            achievementsHtml += "<div class='achievement'>";
            achievementsHtml += "<div style='float: left;'><img src='" + a.ImageUrl + "' /></div>";
            achievementsHtml += "<div><h3>" + a.Name + "</h3><p>" + a.Description + "</p></div>";
            achievementsHtml += "<br class='clear'/></div>";
        }

        log(achievementsHtml);
        $achievements.html(achievementsHtml);
    };

    var parameters = { "SteamUserId": steamUserId, "GameId": gameId };
    callAjax("GetAchievements", parameters, ondone);
}

function updateAchievements()
{
    var $updating = $("#updating");
    $updating.show();

    var ondone = function(data)
    {
        $updating.hide();

        getAchievements();
    };

    var steamUserId = $("#steamIdTextBox").val();
    var parameters = { "SteamUserId": steamUserId };
    callAjax("UpdateAchievements", parameters, ondone);
}

function updateSteamUserId()
{
    var $steamIdError = $("#steamIdError");
    $steamIdError.removeClass("error");

    var steamUserId = $("#steamIdTextBox").val();

    if (steamUserId == null || steamUserId == "")
    {
        $steamIdError.addClass("error");
        return false;
    }

    var faceBookUserId = $("#facebookUserIdHidden").val();

    var ondone = function(data) { /* display update success message */ };

    var parameters = { "FacebookUserId": faceBookUserId, "SteamUserId": steamUserId };
    callAjax("UpdateSteamUserId", parameters, ondone);
}

function callAjax(method, query, ondone)
{
    var onerror = function(m)
    {
        $("#log").text(m.Message).show();
    };

    $.ajax({
        url: _serviceBase + method,
        data: JSON.stringify(query),
        type: "POST",
        processData: true,
        contentType: "application/json",
        timeout: 10000,
        dataType: "json",
        success: ondone,
        error: function(xhr)
        {
            if (!onerror)
            {
                return;
            }
            
            if (xhr.responseText)
            {
                try
                {
                    var err = JSON.parse(xhr.responseText);
                    if (err)
                    {
                        onerror(err);
                    }
                    else
                    {
                        onerror({ Message: "Unknown server error." });
                    }
                }
                catch (e)
                {
                    onerror({ Message: e.toString() });
                }
            }
            return;
        }
    });
}

function log(message)
{
    if (_log)
    {
        $("#log").append(message);
    }
}