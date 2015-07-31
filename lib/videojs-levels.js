/*! videojs-levels
 * Copyright (c) 2015 Hector G. Parra
 * Licensed under the Apache-2.0 license. */
(function(window, videojs) {
  'use strict';

  var defaults = {};

  /**
   * Return currently used MediaTechController.
   *
   * @method Player.getTech
   * @return MediaTechController
   */
  videojs.Player.prototype.getTech = function () {
    for (var key in this) {
      if (this[key] instanceof videojs.MediaTechController) {
        return this[key];
      }
    }
    return null;
  };

  /**
   * Return MediaTechController's HTML Element.
   *
   * @method MediaTechController.getEl
   * @return HTMLElement
   */
  videojs.MediaTechController.prototype.getEl = function () {
    for (var key in this) {
      if (this[key] instanceof HTMLElement) {
        return this[key];
      }
    }
    return null;
  };

  /**
   * Return MenuButton's MenuItems.
   *
   * @method MenuButton.getItems
   * @return MenuItem[]
   */
  videojs.MenuButton.prototype.getItems = function () {
    for (var key in this) {
      var isItems = Array.isArray(this[key]) && this[key].every(function (i) {
        return i instanceof videojs.MenuItem;
      });
      if (isItems) {
        return this[key];
      }
    }
    return [];
  };

  /**
   * Get Levels.
   * This provides interface to either Player tech.
   *
   * @method getLevels
   * @return Levels[]
   */
  videojs.Player.prototype.getLevels = function () {
    return this.getTech().getLevels();
  };

  /**
   * Set current level.
   * This provides interface to either Player tech.
   *
   * @method setLevel
   * @param  {Number} level
   * @return Levels[]
   */
  videojs.Player.prototype.setLevel = function (level) {
    this.getTech().setLevel(level);
  };

  //
  // [FLASH] getLevels/setLevel implementation
  //

  videojs.Flash.prototype.getLevels = function () {
    return this.getEl().vjs_getProperty('levels') || [];
  };

  videojs.Flash.prototype.setLevel = function (level) {
    this.getEl().vjs_setProperty('level', level);
  };

  //
  // [Html5] getLevels/setLevel implementation
  //

  videojs.Html5.prototype.getLevels = function () {
    return [];
  };

  videojs.Html5.prototype.setLevel = function (level) {
    // Do nothing
  };

  /**
   * LevelsMenuButton
   */
  videojs.LevelsMenuButton = videojs.MenuButton.extend({

    className: 'vjs-menu-button-levels',

    init: function (player, options) {
      videojs.MenuButton.call(this, player, options);
    },

    createItems: function () {

      var component = this;
      var player = component.player();

      // Prepend levels with 'Auto' item
      var levels = [{
        name:  'Auto',
        index:  -1
      }].concat(player.getLevels());

      return levels.map(function (level, idx) {

        // Select a label based on available information
        // name and height are optional in manifest
        var levelName =
          level.name ||
          level.height ||
          Math.round(level.bitrate / 1000) + 'kb';

        var item = new videojs.MenuItem(player, {
          label:    levelName,
          value:    level.index,
          selected: level.index === -1 // Assume Auto is preselected
        });

        item.on('click', function (evt) {
          component.getItems().forEach(function (i) {
            i.selected(false);
          });

          this.selected(true);

          player.setLevel(this.options().value);
        });

        return item;
      });
    },

  });

  // register the plugin
  videojs.plugin('levels', function(options) {

    var settings = videojs.util.mergeOptions(defaults, options);
    var player = this;
    var button = null;

    player.on('loadedmetadata', function (evt) {
      if (button) {
        button.dispose();
      }
      button = new videojs.LevelsMenuButton(player, settings);
      player.controlBar.addChild(button);
    });
  });

})(window, window.videojs);
