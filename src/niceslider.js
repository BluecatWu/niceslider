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
  /*var _prefix = (function () {
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
  }())*/
  
  /**
   * ������
   * @param {Boolean} unlimit �Ƿ�ִ���޷�ѭ��
   * @param {Boolean} ctrlBtn �Ƿ�������ҿ��ư�ť
   * @param {Boolean} indexBtn �Ƿ�������б�ǩ
   * @param {Function} indexFormat indxBtnΪtrue������£����б�ǩ���ݵ�format����������ֵ���������ǩԪ����
   * @param {Number} offset ƫ��ֵ
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
    offset: 0,
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
    var d = {}
    //Zepto��һЩ�����������translate3d��Ч
    //���ֶ�����Ӳ������
    if (!isVertical) {
      //d[_prefix + 'ransform'] = 'translate3d(' + dist + 'px, 0, 0)'
      d.left = dist + 'px'
    } else {
      //d[_prefix + 'ransform'] = 'translate3d(0, ' + dist + 'px, 0)'
      d.top = dist + 'px'
    }
    jDom.css(d)
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
      //speed = distence / (time || 300),
      smoothNumber = 10,
      //unitDistence = speed * smoothNumber,
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
        _setDist(jDom, end, isVertical)
        args.cb && args.cb.apply(that)
        that._animating = false
        that.cfg.onChange && that.cfg.onChange.apply(that)
      }
    }, smoothNumber)
  }
  
  /**
   * ȡ����������
   * @type {Function}
   */
  function _cancelAnimate () {
    if (this._animating) {clearInterval(this._aniTimer); this._animating = false; _resetIndex.apply(this)}
  }
  
  /**
   * ����Ԫ��λ�ƶ���
   * @type {Function} 
   * @param {Object} jDom jQuery/Zepto����
   * @param {Number} left λ��ֵ
   */
  function _setAnimate (start, end, time) {
    //jDom.animate(data, 300, 'swing', function () {})
    _animate.call(this, {
      dom: this.jBox,
      start: start,
      end: end,
      time: time || 300,
      cb: _resetIndex
    })
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
      items = this.jItems,
      l = items.length,
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
      multiple = 1,
      isVertical = cfg.dir === 'h' ? false : true
    
    this.isVertical = isVertical
    
    //����refresh���
    if (this.jWrapper) {
      var div = $('<div></div>')
      div.append(box)
      this.jWrapper.after(box)
      this.jWrapper.remove()
      delete this.jWrapper
    }
    
    box.wrap(html)
    this.jWrapper = wrapper = box.closest('.slider-wrapper')
    this.jItems = items = box.children()
    this.jContent = content = wrapper.find('.slider-content')
    if (cfg.ctrlBtn) {
      wrapper.append('<div class="slider-control"><span class="prev"><span class="prev-s"></span></span><span class="next"><span class="next-s"></span></span></div>')
      _bindCtrlBtn.call(this, wrapper.find('.prev'), wrapper.find('.next'))
      this.jCtrl = this.jWrapper.find('.slider-control')
    }
    if (items.length > 1) {
      if (cfg.indexBtn) {
        _createSteps.apply(this)
      }
      if (cfg.unlimit) {
        box.append(items.clone())
        multiple = 2
        if (items.length === 2) {
          box.append(items.clone())
          multiple = 3
        }
      
        //���»�ȡslider item
        this.jItems = items = box.children()
      }
      this.multiple = multiple
      this.realLength = items.length / multiple
      //Zepto����û��outWidth����������ʹ��width
      this.itemWidth = width = items.width()
      this.itemHeight = height = items.height()
      if (!isVertical) {
        this.jItems.width(width)
        box.width(width * items.length)
        this.boxWidth = Math.ceil(box.width() / multiple)
        content.height(box.height())
        this.rangeWidth = this.boxWidth - this.jWrapper.width() + cfg.offset
        this.currentLeft = cfg.index * this.itemWidth
      } else {
        this.jItems.height(height)
        box.height(height * items.length)
        this.boxHeight = Math.ceil(box.height() / multiple)
        content.width(box.width())
        this.rangeHeight = this.boxHeight - this.jWrapper.height() + cfg.offset
        this.currentTop = cfg.index * this.itemHeight
      }
      this.moveTo(cfg.index, true)
    } else {
      this.multiple = 1
      this.itemWidth = width = items.width()
      this.itemHeight = height = items.height()
      this.realLength = 1
      if (!isVertical) {
        box.width(width)
        content.height(box.height())
        this.boxWidth = width
        this.rangeWidth = 0
        wrapper.addClass('slider-no-effect')
        this.currentLeft = 0
        this.moveTo(0, true)
      } else {
        box.height(height)
        content.width(box.width())
        this.boxHeight = height
        this.rangeHeight = 0
        wrapper.addClass('slider-no-effect')
        this.currentTop = 0
        this.moveTo(0, true)
      }
    }
    
  }
  
  ////////////////////////darg���
  var _origin = {},
    _currentPoint = {},
    _locked = false,
    _isChecked = false,
    _dir = true,
    _distance = 0,
    _currentSlider = null,
    _sliderArray = [],
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
    this.touched = true
    _origin = _getXY(e)
    _locked = false
    _isChecked = false
    _dir = 0
    _distance = 0
    _sliderArray.push(this)
    if (this.timer) {clearTimeout(this.timer)}
  }
  
  /**
   * ������
   * @type {Function} 
   * @param {Object} e
   */
  function _touchmove (e) {
    _currentSlider = _sliderArray[0]
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
      _currentSlider.moveingDist = 0
      _currentSlider = null
      _sliderArray = []
    }
  }
  
  /**
   * �������
   * @type {Function} 
   * @param {Object} e
   */
  function _handleScroll (e) {
    if (_currentSlider) {
      _currentSlider.touched = false
      _origin = {}
      _currentPoint = {}
      _locked = false
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
      if ((this.isVertical && Math.abs(deltaX) > Math.abs(deltaY))|| (!this.isVertical && Math.abs(deltaY) > Math.abs(deltaX))) {
        _locked = false
        this.touched = false
        _sliderArray.shift()
        if (_sliderArray.length) {
          _currentPoint = _sliderArray[0]
          _checkDir.call(_currentPoint, deltaX, deltaY)
        } else {
          this.touched = false
          _isChecked = true
        }
      } else {
        _locked = true
        _isChecked = true
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
      return
    }
    //����slider��������
    _dir = delta > 0
    _distance = delta
    _move.call(_currentPoint, delta)
  }
  
  ///////////////drag���
  
  /**
   * slider��Ե�ǰλ�����ƶ�
   * @type {Function} 
   * @param {Number} dist λ�ƾ���
   */
  function _move (dist) {
    var isVertical = this.isVertical,
      origin = isVertical ? this.currentTop : this.currentLeft,
      range = isVertical ? this.rangeHeight : this.rangeWidth
    var dist = origin + dist
    if (!this.cfg.bounce && !this.cfg.unlimit) {
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
    var isVertical = this.isVertical,
      idx = this.currentIndex,
      unitDist = isVertical ? this.itemHeight : this.itemWidth,
      l = this.jItems.length,
      rl = this.realLength,
      d = Math.abs(_distance),
      deltaIndex = 0
    //δ���������¼� _dir��0 ����booleanֵ
    if (_dir === 0) {return}
            
    if (this.cfg.unlimit) {
      _dir ? this.prev() : this.next()
    } else {
      //���ݻ��������жϻ����˶��ٸ�item
      if (d > unitDist / 4) {
        deltaIndex = (_dir ? -1 : 1) * Math.ceil(d / unitDist)
      }
      idx = idx + deltaIndex
      idx = Math.max(0, Math.min(idx, this.realLength - 1))
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
   * �ṩһ���ӿ����û������ȷ�ĵ�ǰ����
   * @type {Function} 
   */
  function _getIndex () {
    return this.currentIndex % l
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
        //that.next()
        
        var idx = that.currentIndex + 1
        if (that.cfg.unlimit) {
          that.moveTo(idx)
        } else {
          idx = idx % that.realLength
          that.moveTo(idx)
        }
        
        _setAutoPlay.apply(that)
      }, this.cfg.duration)
    }
  }
  
  /**
   * �޷�ѭ��ʱ���������������ú����index
   * @type {Function} 
   */
  function _resetIndex () {
    var idx, rl, l
    if (this.cfg.unlimit && !this.touched) {
      idx = this.currentIndex
      rl = this.realLength
      l = this.jItems.length
      if (rl > 1) {
        if (idx <= 1) {
          idx = rl + 1
          this.setIndexTo(idx)
        } else if (idx >= l - 2) {
          idx = l - 2 - rl
          this.setIndexTo(idx)
        }
      }
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
      l = this.jItems.length,
      unitDist = isVertical ? this.itemHeight : this.itemWidth,
      range = isVertical ? this.rangeHeight : this.rangeWidth,
      offset = this.cfg.offset,
      multiple = this.multiple,
      rl = this.realLength,
      dist = 0,
      that = this
    
    if (this.cfg.unlimit) {
      if (rl > 1) {
        if (idx <= 0) {
          idx = rl
          this.setIndexTo(idx + 1)
        } else if (idx >= l - 1) {
          idx = l - 1 - rl
          this.setIndexTo(idx - 1)
        }
        dist = -1 * idx * unitDist + offset
      } else {
        idx = 0
        dist = offset
      }
    } else {
      idx = idx % l
      dist = Math.max(-1 * idx * unitDist + offset, -1 * range)
    }
    
    if (!isImmediate && !this.cfg.noAnimate) {
      _setAnimate.call(this, this.touched ? this.moveingDist : (isVertical ? this.currentTop : this.currentLeft), dist)
    } else {
      _setAnimate.call(this, dist, dist, 0)
    }
    this.currentIndex = idx
    this[isVertical ? 'currentTop' : 'currentLeft'] = dist
    
    if (this.jSteps) {_toggleStepTo.apply(this)}
    if (this.cfg.ctrlBtn) {_checkCtrlBtn.apply(this)}
    _setAutoPlay.apply(this)
  }
  
  /**
   * slider������ʾΪ��Ӧindex��
   * @type {Function} 
   * @param {Number} idx
   */
  function _setIndexTo (idx) {
    var isVertical = this.isVertical,
      wrapper = this.jWrapper,
      l = this.jItems.length,
      unitDist = isVertical ? this.itemHeight : this.itemWidth,
      offset = this.cfg.offset,
      dist = 0
    if (idx.toString() === 'NaN') {return}
    idx = parseInt(idx, 10) % l
    dist = -1 * idx * unitDist + offset
    _setDist(this.jBox, dist, isVertical)
    this.currentIndex = idx
    this[isVertical ? 'currentTop' : 'currentLeft'] = dist
  }
  
  /**
   * slider��ǰ����һ��
   * @type {Function} 
   */
  function _prev () {
    var idx = this.currentIndex - 1
    if (this.cfg.unlimit) {
      this.moveTo(idx)
    } else {
      if (idx < 0) {return}
      this.moveTo(idx)
    }
  }
  
  /**
   * slider���󻬶�һ��
   * @type {Function} 
   */
  function _next () {
    var idx = this.currentIndex + 1
    if (this.cfg.unlimit) {
      this.moveTo(idx)
    } else {
      if (idx >= this.realLength) {return}
      this.moveTo(idx)
    }
  }
  
  /**
   * ˢ��slider
   * @type {Function} 
   * @param {Object}
   */
  function _refresh (cfg) {
    
    if (this.cfg.unlimit === true) {
      _resetItems.apply(this)
    }
    
    this.cfg = _handleCfg($.extend(this.cfg, cfg || {}))
    if (this.timer) {clearTimeout(this.timer)}
    _sliderCount--
    _init.apply(this)
  }
  
  /**
   * ����slider��
   * @type {Function} 
   */
  function _resetItems () {
    var l = this.realLength - 1
    this.jItems.each(function (i, o) {
      if (i > l) {$(o).remove()}
    })
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
    //this.jBox.on(ev.move, function (e) {
      //if (_locked) {e.preventDefault()}
    //})
    if (!_bound) {
      $(document).on(ev.move, _touchmove).on(ev.end, _touchend)
      //$(window).on('scroll', _handleScroll)
      _bound = true
    }
  }
  
  /**
   * �Ƴ������¼�
   * @type {Function} 
   */
  function _unbind () {
    $(document).off(ev.move, _touchmove).off(ev.end, _touchend)
    //$(window).off('scroll', _handleScroll)
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
    setIndexTo: _setIndexTo,
    moveTo: _moveTo,
    getIndex: _getIndex,
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