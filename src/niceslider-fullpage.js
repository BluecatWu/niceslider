"use strict"
;(function ($) {  
  
  /**
   * NiceSlider
   */
  
  //����PC���ƶ����¼�
  var _mobileCheck = 'ontouchend' in document,
    ev = {
      click: 'click',
      start: _mobileCheck ? 'touchstart' : 'mousedown',
      move: _mobileCheck ? 'touchmove' : 'mousemove',
      end: _mobileCheck ? 'touchend' : 'mouseup'
    }
  
  //��ȡ�����ǰ׺
  var _prefix = (function () {
    var div = document.createElement('div'),
      style = div.style
    if (style.webkitTransform) {
      return '-webkit-'
    } else if (style.mozTransform) {
      return '-moz-' 
    } else if (style.msTransform) {
      return '-ms-'
    } else {
      return ''
    }
  }())
  
  /**
   * ������
   * @param {Boolean} unlimit �Ƿ�ִ���޷�ѭ��
   * @param {Boolean} ctrlBtn �Ƿ�������ҿ��ư�ť
   * @param {Boolean} indexBtn �Ƿ�������б�ǩ
   * @param {Function} indexFormat indxBtnΪtrue������£����б�ǩ���ݵ�format����������ֵ���������ǩԪ����
   * @param {Number} index ��ʼ�����
   * @param {String} dir �ƶ�����
   * @param {Boolean} autoPlay �Ƿ��Զ�����
   * @param {Number} duration �Զ����ż��ʱ��
   * @param {Boolean} bounce �Ƿ���лص�Ч��
   * @param {Boolean} drag �Ƿ�֧����ק
   * @param {Boolean} indexBind indxBtnΪtrue������£��Ƿ�����б�ǩ��ӻ����¼�
   * @param {Function} onChange ��λ����ִ����ɺ󴥷�
   * @param {Boolean} noAnimate �رն���
   * @param {String} animation ָ������Ч��
   */
  var _defaultConfig = {
    unlimit: true,
    ctrlBtn: true,
    indexBtn: true,
    /*indexFormat: function (i) {
      return '��' + i + '��'
    },
    extendAnimate: {
      'swing': function (t, b, c, d) {
        return t / d * c + b
      }
    }
    */
    index: 0,
    dir: 'h',
    autoPlay: false,
    duration: 5000,
    bounce: true,
    drag: true,
    indexBind: true,
    noAnimate: false,
    animation: 'ease-out-back'
  }
  
  /**
   * ����������
   * @type {Function} 
   * @param {Object} cfg
   * @return {Object}
   */
  function _handleCfg (cfg) {
    return $.extend({}, _defaultConfig, cfg)
  }
  
  /**
   * ����Ԫ��λ��
   * @type {Function} 
   * @param {Object} jDom jQuery/Zepto����
   * @param {Number} dist λ��ֵ
   */
  function _setDist (jDom, dist, isVertical) {
    if (!isVertical) {
      jDom.css(_prefix + 'transform', 'translate3d(' + dist + 'px, 0, 0)')
    } else {
      jDom.css(_prefix + 'transform', 'translate3d(0, ' + dist + 'px, 0)')
    }
  }
  
  /**
   * ʱ����Ť������
   * @param {Number} t current time����ǰʱ�䣩
   * @param {Number} b beginning value����ʼֵ����0����b=0��
   * @param {Number} c change in value���仯������1����c=1��
   * @param {Number} d duration������ʱ�䣩 ��1����d=1��
   * @return {Number}
   */
  var _animationFunction = {
    'ease-out-back': function (t, b, c, d) {
      var s = 1.70158
      return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b
    },
    'linear': function (t, b, c, d) {
      return t / d * c + b
    }
  }
  
  /**
   * ��Ӷ�������
   * @param {Object} obj ��������
   */
  function _extendAnimate (obj) {
    $.extend(_animationFunction, obj)
  }
  
  /**
   * ��������
   * @param {Object} args
   */
  function _animate (args) {
    var start = args.start || 0,
      end = args.end || 0,
      jDom = args.dom,
      time = args.time,
      distence = end - start,
      current = start,
      smoothNumber = 10,
      pastTime = 0,
      isVertical = this.isVertical,
      that = this
    if (this._aniTimer) {clearInterval(this._aniTimer)}
    //_animating��ʱû������
    this._animating = true
    this._aniTimer = setInterval(function () {
      if (_animationFunction[that.cfg.animation]) {
        current = _animationFunction[that.cfg.animation](pastTime, start, distence, time)
      } else {
        current = _animationFunction.linear(pastTime, start, distence, time)
      }
      _setDist(jDom, current, isVertical)
      
      //����һ�������ǰ��λ��ֵ���������Ʋ���ʱʹ��
      this.moveingDist = current
      
      pastTime += smoothNumber
      if (pastTime >= time) {
        clearInterval(that._aniTimer)
        args.cb && args.cb.apply(that)
        that._animating = false
        that.moveingDist = 0
        that.cfg.onChange && that.cfg.onChange.apply(that)
      }
    }, smoothNumber)
  }
  
  /**
   * ȡ����������
   * @type {Function}
   */
  function _cancelAnimate () {
    if (this._animating) {clearInterval(this._aniTimer); this._animating = false; _setDom.apply(this)}
  }
  
  /**
   * ����Ԫ��λ�ƶ���
   * @type {Function} 
   * @param {Object} jDom jQuery/Zepto����
   * @param {Number} left λ��ֵ
   */
  function _setAnimate (start, end, time) {
    _animate.call(this, {
      dom: this.jBox,
      start: start,
      end: end,
      time: time || 300,
      cb: _setDom
    })
  }
  
  /**
   * ������ɺ���������DOMԪ��
   * @type {Function} 
   */
  function _setDom () {
    var isVertical = this.isVertical,
      dist = isVertical ? this.itemHeight : this.itemWidth,
      unlimit = this.cfg.unlimit,
      item = this.jItems,
      l = this.realLength,
      offset = 0,
      idx = this.currentIndex,
      dom = $(document.createDocumentFragment()),
      prev = null,
      next = null,
      current = null,
      i = 0
    
    if (idx > 0) {
      prev = item.eq(idx - 1).clone(true)
      offset = -dist
      i++
    } else if (unlimit) {
      prev = item.eq(l - 1).clone(true)
      offset = -dist
      i++
    }
    dom.append(prev)
    
    current = item.eq(idx).clone(true)
    dom.append(current)
    i++
    
    if (idx < l - 1) {
      next = item.eq(idx + 1).clone(true)
      i++
    } else if (unlimit) {
      next = item.eq(0).clone(true)
      i++
    }
    dom.append(next)
    
    isVertical ? this.jBox.height(dist * i) : this.jBox.width(dist * i)
    this.jBox.html('').append(dom)
    this.startPosition = offset
    _setDist(this.jBox, offset, isVertical)
  }
  
  /**
   * Ϊǰ�����Ԫ�ذ��¼�
   * @type {Function} 
   * @param {Object} prevBtn 
   * @param {Object} nextBtn 
   */
  function _bindCtrlBtn (prevBtn, nextBtn) {
    var that = this
    prevBtn.on(ev.click, function () {
      that.prev()
    })
    nextBtn.on(ev.click, function () {
      that.next()
    })
    this.jPrevBtn = prevBtn
    this.jNextBtn = nextBtn
  }
  
  /**
   * ������������
   * @type {Function} 
   */
  function _createSteps () {
    var i = 0,
      l = this.realLength,
      html = '<ol class="slider-steps">',
      indexFormat = this.cfg.indexFormat,
      that = this,
      steps = null
    for (i; i < l; i++) {
      html += '<li class="step">' + (indexFormat ? indexFormat.call(that, i) : i) + '</li>'
    }
    html += '</ol>'
    this.jWrapper.append(html)
    if (this.cfg.indexBind) {
      steps = this.jWrapper.find('.slider-steps').on(ev.click, '.step', function () {
        var index = steps.find('.step').index($(this))
        that.moveTo(index)
      })
    } else {
      steps = this.jWrapper.find('.slider-steps')
    }
    this.jSteps = steps
  }
  
  /**
   * �������DOM�ṹ
   * @type {Function} 
   */
  function _create () {
    var html = '<div class="slider-wrapper"><div class="slider-content"></div></div>',
      cfg = this.cfg,
      box = this.jBox,
      items = null,
      wrapper = null,
      content = null,
      width = 0,
      height = 0,
      isVertical = cfg.dir === 'h' ? false : true
    
    this.isVertical = isVertical
    
    //����refresh���
    if (this.jWrapper) {
      items = this.jShadowBox.children()
      box.empty().append(items)
      delete this.jShadowBox
    } else {
      box.wrap(html)
    }
    
    this.jWrapper = wrapper = box.parents('.slider-wrapper')
    this.jItems = items = box.children()
    this.jContent = content = wrapper.find('.slider-content')
    this.realLength = items.length
    if (cfg.ctrlBtn) {
      wrapper.append('<div class="slider-control"><span class="prev"><span class="prev-s"></span></span><span class="next"><span class="next-s"></span></span></div>')
      _bindCtrlBtn.call(this, wrapper.find('.prev'), wrapper.find('.next'))
      this.jCtrl = this.jWrapper.find('.slider-control')
    }
    if (cfg.indexBtn) {
      _createSteps.apply(this)
    }
    this.itemWidth = width = items.width()
    this.itemHeight = height = items.height()
    
    if (!isVertical) {
      items.width(width)
      box.width(width)
      content.height(height)
    } else {
      items.height(height)
      box.height(height)
      content.width(width)
    }
    
    this.jShadowBox = $('<div></div>').append(items)
    this.moveTo(cfg.index, true)
    
  }

  var _origin = {},
    _currentPoint = {},
    _locked = false,
    _isChecked = false,
    _dir = true,
    _distance = 0,
    _currentSlider = null,
    _bound = false,
    _sliderCount = 0
  
  /**
   * ��ȡ�¼������е�����ֵ
   * @type {Function} 
   * @param {Object} e
   * @return {Object} ��������ֵ�Ķ���
   */
  var _getXY = function (e) {
    var e = e.originalEvent ? e.originalEvent : e,
      touches = e.touches,
      x = 0,
      y = 0
    if (touches) {
      x = touches[0].pageX
      y = touches[0].pageY
    } else {
      x = e.clientX
      y = e.clientY
    }
    
    return {x: x, y: y} 
  }
  
  /**
   * ������
   * @type {Function} 
   * @param {Object} e
   */
  function _touchstart (e) {
    _cancelAnimate.apply(this)
    //if (this._animating) {return}
    this.touched = true
    _origin = _getXY(e)
    _locked = false
    _isChecked = false
    _dir = 0
    _distance = 0
    _currentSlider = this
    if (this.timer) {clearTimeout(this.timer)}
  }
  
  /**
   * ������
   * @type {Function} 
   * @param {Object} e
   */
  function _touchmove (e) {
    if (_currentSlider && _currentSlider.cfg.drag) {
      if (_currentSlider.touched) {
        _currentPoint = _getXY(e)
        _handleMove.call(_currentSlider, _currentSlider.isVertical ? (_currentPoint.y - _origin.y) : (_currentPoint.x - _origin.x))
        if (_locked) {e.preventDefault()}
      }
    }
  }
  
  /**
   * �����ͷ�
   * @type {Function} 
   * @param {Object} e
   */
  function _touchend (e) {
    if (_currentSlider) {
      if (_currentSlider.cfg.drag) {
        _origin = {}
        _currentPoint = {}
        if (_locked) {_checkIndex.apply(_currentSlider)}
        _currentSlider.touched = false
        _locked = false
      }
      _setAutoPlay.apply(_currentSlider)
      _currentSlider = null
    }
  }
  
  /**
   * �ж�����/���һ���
   * @type {Function} 
   * @param {Number} deltaX
   * @param {Number} deltaY
   */
  function _checkDir (deltaX, deltaY) {
    if (!_isChecked) {
      _isChecked = true
      
      if ((this.isVertical && Math.abs(deltaX) > Math.abs(deltaY))|| (!this.isVertical && Math.abs(deltaY) > Math.abs(deltaX))) {
        _locked = false
        this.touched = false
      } else {
        _locked = true
      }
    }
  }
  
  /**
   * ��������ƶ�
   * @type {Function} 
   * @param {Number} delta
   */
  function _handleMove (delta) {
    if (!_isChecked) {
      _checkDir.call(this, _currentPoint.x - _origin.x, _currentPoint.y - _origin.y)
    }
    //����slider��������
    _dir = delta > 0
    _distance = delta
    _move.call(this, delta)
  }
    
  /**
   * slider��Ե�ǰλ�����ƶ�
   * @type {Function} 
   * @param {Number} dist λ�ƾ���
   */
  function _move (dist) {
    var isVertical = this.isVertical,
      unlimit = this.cfg.unlimit,
      origin = this.currentIndex === 0 && !unlimit ? 0 : (isVertical ? -this.itemHeight : -this.itemWidth),
      range = -origin * (this.currentIndex === this.realLength - 1 && !unlimit ? 1 : 2)
    dist = origin + dist
    if (!this.cfg.bounce && !unlimit) {
      dist = Math.min(0, Math.max(dist, -1 * range))
    }
    _setDist(this.jBox, dist, isVertical)
    this.moveingDist = dist
  }
  
  /**
   * ��slider���ƶ�ֵ�����ȷ����ǰindex
   * @type {Function} 
   */
  function _checkIndex () {
    var d = Math.abs(_distance),
      idx = this.currentIndex
    //δ���������¼� _dir��0 ����booleanֵ
    if (_dir === 0) {return}
    if (d > 20) {
      _dir ? this.moveTo(idx - 1) : this.moveTo(idx + 1)
    } else {
      this.moveTo(idx)
    }
  }
  
  /**
   * ��slider�Ŀ��ư�ť�����
   * @type {Function} 
   */
  function _checkCtrlBtn () {
    var idx = this.currentIndex,
      cfg = this.cfg,
      l = this.realLength,
      pb = this.jPrevBtn,
      nb = this.jNextBtn
    
    if (!cfg.unlimit) { 
      //�����ư�ť״̬
      if (idx === 0) {
        pb.addClass('disable')
      } else {
        pb.removeClass('disable')
      }
      if (idx === l - 1) {
        nb.addClass('disable')
      } else {
        nb.removeClass('disable')
      }
    } else {
      if (l === 1) {
        pb.addClass('disable')
        nb.addClass('disable')
      }
    }
  }
  
  /**
   * ������ǰindex
   * @type {Function} 
   */
  function _toggleStepTo () {
    var idx = this.currentIndex,
      cfg = this.cfg,
      l = this.realLength,
      pb = this.jPrevBtn,
      nb = this.jNextBtn
     
    this.jSteps.find('.step').removeClass('current').eq(idx % l).addClass('current')
  }
  
  /**
   * ִ���Զ�����
   * @type {Function} 
   */
  function _setAutoPlay () {
    var that = this,
      cfg = this.cfg
    if (cfg.autoPlay) {
      if (this.timer) {clearTimeout(this.timer)}
      this.timer = setTimeout(function () {
        
        var idx = that.currentIndex + 1
        that.moveTo(idx)
        
        _setAutoPlay.apply(that)
      }, this.cfg.duration)
    }
  }
  
  /**
   * slider��λ����Ӧindex
   * @type {Function} 
   * @param {Number} idx
   * @param {Boolean} isImmediate �Ƿ�������λ
   */
  function _moveTo (idx, isImmediate) {
    var isVertical = this.isVertical,
      l = this.realLength,
      cIdx = this.currentIndex,
      unitDist = isVertical ? this.itemHeight : this.itemWidth,
      unlimit = this.cfg.unlimit,
      that = this,
      start = this.startPosition || 0,
      end = 0,
      i = 0
    
    if (unlimit) {
      if (idx < 0) {
        idx = l - 1
        end = 0
      } else if (idx >= l) {
        idx = 0
        end = start * 2
      } else {
        end = start + (idx - cIdx) * -unitDist
      }
    } else {
      if (idx < 0) {
        idx = 0
        end = start
      } else if (idx >= l) {
        idx = l - 1
        end = start
      } else {
        end = start + (idx - cIdx) * -unitDist
      }
    }
    
    if (!isImmediate && !this.cfg.noAnimate) {
      _setAnimate.call(this, this.touched ? this.moveingDist : start, end)
    } else {
      _setAnimate.call(this, end, end, 0)
    }
    this.currentIndex = idx
    
    if (this.jSteps) {_toggleStepTo.apply(this)}
    if (this.cfg.ctrlBtn) {_checkCtrlBtn.apply(this)}
    _setAutoPlay.apply(this)
  }
  
  /**
   * slider��ǰ����һ��
   * @type {Function} 
   */
  function _prev () {
    var idx = this.currentIndex - 1
    if (!this.cfg.unlimit && idx < 0) {return}
    this.moveTo(idx)
  }
  
  /**
   * slider���󻬶�һ��
   * @type {Function} 
   */
  function _next () {
    var idx = this.currentIndex + 1
    if (!this.cfg.unlimit && idx >= this.realLength) {return}
    this.moveTo(idx)
  }
  
  /**
   * ˢ��slider
   * @type {Function} 
   * @param {Object}
   */
  function _refresh (cfg) {
    this.cfg = _handleCfg($.extend(this.cfg, cfg || {}))
    if (this.timer) {clearTimeout(this.timer)}
    _sliderCount--
    _init.apply(this)
  }
  
  /**
   * ����ʵ������
   * @type {Function} 
   */
  function _destroy () {
    var item = ''
    this.jWrapper.remove()
    for (item in this) {
      delete this[item]
    }
    
    this.__proto__ = null
    
    _sliderCount--
    if (_sliderCount === 0) {
      _unbind()
    }
  }
  
  /**
   * ����ק����¼�
   * @type {Function} 
   */
  function _bind () {
    var that = this
    this.jContent.on(ev.start, function (e) {_touchstart.call(that, e)})
    if (!_bound) {
      $(document).on(ev.move, _touchmove).on(ev.end, _touchend)
      _bound = true
    }
  }
  
  /**
   * �Ƴ������¼�
   * @type {Function} 
   */
  function _unbind () {
    $(document).off(ev.move, _touchmove).off(ev.end, _touchend)
    _bound = false
  }
  
  /**
   * ��ʼ��
   * @type {Function} 
   */
  function _init () {
    this.currentIndex = this.cfg.index
    if (this.cfg.extendAnimate) {_extendAnimate(this.cfg.extendAnimate)}
    _create.apply(this)
    _bind.apply(this)
    _setAutoPlay.apply(this)
    _sliderCount++
  }
  
  /**
   * NiceSlider����
   * @type {Function}
   * @param {Object} dom 
   * @param {Object} cfg ������
   */
  function NiceSlider (dom, cfg) {
    this.jBox = $(dom)
    this.cfg = _handleCfg(cfg || {})
    _init.apply(this)
  }
  
  NiceSlider.prototype = {
    prev: _prev,
    next: _next,
    moveTo: _moveTo,
    refresh: _refresh,
    destroy: _destroy
  }
  
  if(typeof define === 'function' && define.amd) {
		define([], function () {
			return NiceSlider
		})
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = NiceSlider
	} else {
		window.NiceSlider = NiceSlider
	}
  
}(window.jQuery || window.Zepto))