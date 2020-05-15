/**
 * @constructor
 * @param {Sk.builtin.type} type_obj
 * @param {Sk.GetSetDef} gsd
 */

Sk.builtin.getset_descriptor = function (type_obj, gsd) {
    this.d$type = type_obj;
    this.d$name = gsd._name;
    this.d$getset = gsd;
};

Sk.abstr.setUpInheritance("getset_descriptor", Sk.builtin.getset_descriptor, Sk.builtin.object);

Sk.builtin.getset_descriptor.sk$acceptable_as_base_class = false;

Sk.builtin.getset_descriptor.prototype.tp$descr_get = function (obj, type) {
    if (Sk.builtin.checkNone(obj)) {
        return this;
    } else if (!(Sk.builtin.type.$isSubTypeInternal(obj.ob$type, this.d$type))) {
        throw new Sk.builtin.TypeError("descriptor '"+ this.d$name + "' for '"+ this.d$type.prototype.tp$name + "' object doesn't apply to a '" + Sk.abstr.typeName(obj) + "' object");
    } 

    if (this.d$getset && this.d$getset.get !== undefined) {
        return this.d$getset.get.call(obj, this.d$getset.closure);
    }

    throw new Sk.builtin.AttributeError("getset_descriptor '"+ this.d$name +"' of '" + this.d$type.prototype.tp$name + "' objects is not readable");
};


Sk.builtin.getset_descriptor.prototype.tp$descr_set = function (obj, value) {
    if (!(Sk.builtin.type.$isSubTypeInternal(obj.ob$type, this.d$type))) {
        throw new Sk.builtin.TypeError("descriptor '"+ this.d$name + "' for '"+ this.d$type.prototype.tp$name + "' object doesn't apply to a '" + Sk.abstr.typeName(obj) + "' object");
    } else if (this.d$getset.set !== undefined){
        return this.d$getset.set.call(obj, value, this.d$getset.closure);
    }
    throw new Sk.builtin.AttributeError("getset_descriptor '"+ this.d$name +"' of '" + this.d$type.prototype.tp$name + "' objects is not writeable");
};

Sk.builtin.getset_descriptor.prototype.$r = function () {
    return new Sk.builtin.str("<getset_descriptor '"+ this.d$name +"' of '"+ this.d$type.prototype.tp$name+"' objects>");
};

Sk.builtin.getset_descriptor.prototype.tp$getsets = [
    new Sk.GetSetDef("__doc__", function () {
        return this.d$getset.doc ? new Sk.builtin.str(this.d$getset.doc) : Sk.builtin.none.none$;
    }),
    new Sk.GetSetDef("__objclass__", function () {
        return this.d$type;
    }),
    new Sk.GetSetDef("__name__", function () {
        return new Sk.builtin.str(this.d$name);
    })
];



/**
 * @constructor
 * @param {Sk.builtin.func} fget
 * @param {Sk.builtin.func} fset
 * @param {Sk.builtin.func} fdel
 * @param {Sk.builtin.str || String} doc
 */

Sk.builtin.property = function (fget, fset, fdel, doc) {
    // this can be uses as an internal function 
    // typically these properties will be set in the init method
    this.prop$get = fget || Sk.builtin.none.none$;
    this.prop$set = fset || Sk.builtin.none.none$;
    this.prop$del = fdel || Sk.builtin.none.none$;
    if (doc !== undefined) {
        this.prop$doc = doc;
    } else if (fget && fget.f$doc) {
        this.prop$doc = fget.f$doc;
    } else {
        this.prop$doc = Sk.builtin.none.none$;
    }
};

Sk.abstr.setUpInheritance("property", Sk.builtin.property, Sk.builtin.object);


Sk.builtin.property.prototype.tp$new = Sk.builtin.genericNew(Sk.builtin.property);

Sk.builtin.property.prototype.__new__ = function (cls) {
    return cls.prototype.tp$new();
}



Sk.builtin.property.prototype.tp$init = function (args, kwargs) {
    args = Sk.abstr.copyKeywordsToNamedArgs(["fget", "fset", "fdel", "doc"], args, kwargs, "property");

    const fget = args[0];
    const fset = args[1];
    const fdel = args[2];
    const doc = args[3];

    this.prop$get = fget || Sk.builtin.none.none$;
    this.prop$set = fset || Sk.builtin.none.none$;
    this.prop$del = fdel || Sk.builtin.none.none$;

    if (doc !== undefined) {
        this.prop$doc = doc;
    } else if (fget && fget.f$doc) {
        this.prop$doc = fget.f$doc;
    } else {
        this.prop$doc = Sk.builtin.none.none$;
    }

    return Sk.builtin.none.none$;
};



Sk.builtin.property.prototype.tp$doc = "Property attribute.\n\n  fget\n    function to be used for getting an attribute value\n  fset\n    function to be used for setting an attribute value\n  fdel\n    function to be used for del\'ing an attribute\n  doc\n    docstring\n\nTypical use is to define a managed attribute x:\n\nclass C(object):\n    def getx(self): return self._x\n    def setx(self, value): self._x = value\n    def delx(self): del self._x\n    x = property(getx, setx, delx, 'I\'m the \'x\' property.')\n\nDecorators make defining new properties or modifying existing ones easy:\n\nclass C(object):\n    @property\n    def x(self):\n        'I am the \'x\' property.'\n        return self._x\n    @x.setter\n    def x(self, value):\n        self._x = value\n    @x.deleter\n    def x(self):\n        del self._x"


Sk.builtin.property.prototype.tp$descr_get = function (obj, type) {
    if (Sk.builtin.checkNone(obj)) {
        return this;
    }

    if (this.prop$get === undefined) {
        throw new Sk.builtin.AttributeError("unreadable attribute")
    }
    
    if (!this.prop$get.tp$call) {
        throw new Sk.builtin.TypeError("'" + Sk.abstr.typeName(this.prop$get) + "' is not callable")
    }

    return this.prop$get.tp$call([obj]);

};

Sk.builtin.property.prototype.tp$descr_set = function (obj, value) {
    if (value === undefined) {
        func = this.prop$del;
    } else {
        func = this.prop$set;
    }
    if (Sk.builtin.checkNone(func)) {
        const msg = value === undefined ? "delete" : "set";
        throw new Sk.builtin.AttributeError("can't " + msg + " attribute");
    }
    if (!func.tp$call) {
        throw new Sk.builtin.TypeError("'" + Sk.abstr.typeName(func) + "' is not callable")
    }

    if (value === undefined) {
        return func.tp$call([obj]);
    } else {
        return func.tp$call([obj, value]);
    }
};

Sk.builtin.property.prototype.getter = function (self, fget) {
    return new Sk.builtin.property(fget, self.prop$set, self.prop$del, self.prop$doc);
};

Sk.builtin.property.prototype.setter = function (self, fset) {
    return new Sk.builtin.property(self.prop$get, fset, self.prop$del, self.prop$doc);
};

Sk.builtin.property.prototype.deleter = function (self, fdel) {
    return new Sk.builtin.property(self.prop$get, self.prop$set, fdel, self.prop$doc);
};

Sk.builtin.property.prototype.tp$getsets = [
    new Sk.GetSetDef("fget", function () {return this.prop$get}),
    new Sk.GetSetDef("fset", function () {return this.prop$set}),
    new Sk.GetSetDef("fdel", function () {return this.prop$del}),
    new Sk.GetSetDef("__doc__", function () {return this.prop$doc}),
];

Sk.builtin.property.pythonFunctions = [
    "getter", "setter", "deleter", "__init__", "__new__"
];



/**
 * @constructor
 * @param {Sk.builtin.func} callable
 */

Sk.builtin.classmethod = function (callable) {
    // this can be used as an internal function 
    // typically callable will be set in the init method if being called by python
    this.cm$callable = callable;
};

Sk.abstr.setUpInheritance("classmethod", Sk.builtin.classmethod, Sk.builtin.object);

Sk.builtin.classmethod.prototype.tp$new = Sk.builtin.genericNew(Sk.builtin.classmethod);


Sk.builtin.classmethod.prototype.tp$init = function (args, kwargs) {
    if (kwargs && kwargs.length) {
        throw new Sk.builtin.TypeError("classmethod() takes no keyword arguments");
    } else if (args.length !== 1) {
        throw new Sk.builtin.TypeError("classmethod expected 1 arguments, got " + args.length);
    }

    this.cm$callable = args[0];

    return Sk.builtin.none.none$;
};

Sk.builtin.classmethod.prototype.tp$doc = "classmethod(function) -> method\n\nConvert a function to be a class method.\n\nA class method receives the class as implicit first argument,\njust like an instance method receives the instance.\nTo declare a class method, use this idiom:\n\n  class C:\n      @classmethod\n      def f(cls, arg1, arg2, ...):\n          ...\n\nIt can be called either on the class (e.g. C.f()) or on an instance\n(e.g. C().f()).  The instance is ignored except for its class.\nIf a class method is called for a derived class, the derived class\nobject is passed as the implied first argument.\n\nClass methods are different than C++ or Java static methods.\nIf you want those, see the staticmethod builtin."


Sk.builtin.classmethod.prototype.tp$descr_get = function (obj, type) {
    if (this.cm$callable === undefined) {
        throw new Sk.builtin.RuntimeError("uninitialized classmethod object")
    }

    if (type === undefined) {
        type = obj.ob$type;
    }

    const f = this.cm$callable.tp$descr_get;
    if (f) {
        return f.call(this.cm$callable, type);
    }
    return new Sk.builtin.method(this.cm$callable, type);

};


Sk.builtin.classmethod.prototype.tp$getsets = [
    new Sk.GetSetDef("__func__", function () {return this.cm$callable}),
];



/**
 * @constructor
 * @param {Sk.builtin.func} callable
 */

Sk.builtin.staticmethod = function (callable) {
    // this can be used as an internal function 
    // typically callable will be set in the init method if being called by python
    this.sm$callable = callable;
};

Sk.abstr.setUpInheritance("staticmethod", Sk.builtin.staticmethod, Sk.builtin.object);

Sk.builtin.staticmethod.prototype.tp$new = Sk.builtin.genericNew(Sk.builtin.staticmethod);

Sk.builtin.staticmethod.prototype.tp$init = function (args, kwargs) {
    if (kwargs && kwargs.length) {
        throw new Sk.builtin.TypeError("staticmethod() takes no keyword arguments");
    } else if (args.length !== 1) {
        throw new Sk.builtin.TypeError("staticmethod expected 1 arguments, got " + args.length);
    }

    this.sm$callable = args[0];

    return Sk.builtin.none.none$;
};

Sk.builtin.staticmethod.prototype.tp$doc = "staticmethod(function) -> method\n\nConvert a function to be a static method.\n\nA static method does not receive an implicit first argument.\nTo declare a static method, use this idiom:\n\n     class C:\n         @staticmethod\n         def f(arg1, arg2, ...):\n             ...\n\nIt can be called either on the class (e.g. C.f()) or on an instance\n(e.g. C().f()).  The instance is ignored except for its class.\n\nStatic methods in Python are similar to those found in Java or C++.\nFor a more advanced concept, see the classmethod builtin."


Sk.builtin.staticmethod.prototype.tp$descr_get = function (obj, type) {
    if (this.sm$callable === undefined) {
        throw new Sk.builtin.RuntimeError("uninitialized staticmethod object")
    }

    return this.sm$callable;

};


Sk.builtin.staticmethod.prototype.tp$getsets = [
    new Sk.GetSetDef("__func__", function () {return this.sm$callable}),
];