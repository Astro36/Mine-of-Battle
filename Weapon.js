/**
 * @file ModPE weapon library
 * @author Astro <astr36@naver.com>
 * @version 1.0
 * @license GPL-3.0
 */

/**
 * @namespace me
 */
let me = this.me || {};

(($, astro) => {
    /**
     * @memberOf me
     * @namespace astro
     */
    "use strict";

    const Thread_ = java.lang.Thread,
        ScriptManager_ = net.zhuoweizhang.mcpelauncher.ScriptManager,
        ScriptableObject_ = org.mozilla.javascript.ScriptableObject,
        NAME = "Weapon Library",
        NAME_CODE = "me_astro_weapon_library",
        VERSION = "1.0";

    /**
     * @memberOf me.astro
     * @namespace weapon
     */

    /**
     * @memberOf me.astro.weapon
     * @namespace behavior
     */



    /**
     * Interface for classes that represent a item.
     * @since 2016-10-26
     * @interface
     * @memberOf me.astro.weapon.behavior
     */
    function IAttackBehavior() {}

    IAttackBehavior.prototype.attack = function () {
        throw new Error("Not implemented");
    };



    /**
     * Interface for classes that represent a item.
     * @since 2016-10-26
     * @interface
     * @memberOf me.astro.weapon.behavior
     */
    function ITouchBehavior() {}

    ITouchBehavior.prototype.touch = function () {
        throw new Error("Not implemented");
    };



    /**
     * Behavior representing to fire attack with a sword.
     * @since 2016-10-26
     * @class
     * @implements {me.astro.weapon.behavior.IAttackBehavior}
     * @memberOf me.astro.weapon.behavior
     * @param {Number} damage Damage of the sword
     */
    function AttackFireWithSword(damage) {
        this._damage = damage;
    }

    AttackFireWithSword.prototype.attack = function (attacker, victim) {
        Entity.setFireTicks(victim, 10);
        Entity.setHealth(victim, Entity.getHealth(victim) - this._damage);
    };



    /**
     * Behavior representing to attack with a sword.
     * @since 2016-10-26
     * @class
     * @implements {me.astro.weapon.behavior.IAttackBehavior}
     * @memberOf me.astro.weapon.behavior
     * @param {Number} damage Damage of the sword
     */
    function AttackWithSword(damage) {
        this._damage = damage;
    }

    AttackWithSword.prototype.attack = function (attacker, victim) {
        Entity.setHealth(victim, Entity.getHealth(victim) - this._damage);
    };



    /**
     * Behavior representing to explode the block.
     * @since 2016-10-26
     * @class
     * @implements {me.astro.weapon.behavior.ITouchBehavior}
     * @memberOf me.astro.weapon.behavior
     * @param {Number} range Range of the magic
     * @param {Boolean} onFire Explode with fire
     */
    function ExplodeWithMagic(range, onFire) {
        this._range = range;
        this._onFire = onFire;
    }

    ExplodeWithMagic.prototype.touch = function (x, y, z, playerEntity) {
        Level.explode(x, y, z, this._range, this._onFire);
    };



    /**
     * Behavior representing to give a potion effect on a target with a magic.
     * @since 2016-10-26
     * @class
     * @implements {me.astro.weapon.behavior.ITouchBehavior}
     * @memberOf me.astro.weapon.behavior
     * @param {Number} range Range of the magic
     * @param {Number} potionType Type of the potion effect
     * @param {Number} potionDuration Duration of the potion effect
     * @param {Number} potionAmp Amplification of the potion effect
     */
    function GivePotionOnTargetWithMagic(range, potionType, potionDuration, potionAmp) {
        this._range = range;
        this._type = potionType;
        this._duration = potionDuration;
        this._amp = potionAmp;
    }

    GivePotionOnTargetWithMagic.prototype.touch = function (x, y, z, playerEntity) {
        let type = this._type,
            duration = this._duration,
            amp = this._amp,
            entities = Entity.getAll();
        for (let i = entities.length; i--;) {
            let entity = entities[i];
            if (playerEntity !== entity) {
                Entity.addEffect(entity, type, duration, amp, false, true);
            }
        }
    };



    /**
     * Behavior representing to give a potion effect on an user with a magic.
     * @since 2016-10-26
     * @class
     * @implements {me.astro.weapon.behavior.ITouchBehavior}
     * @memberOf me.astro.weapon.behavior
     * @param {Number} potionType Type of the potion effect
     * @param {Number} potionDuration Duration of the potion effect
     * @param {Number} potionAmp Amplification of the potion effect
     */
    function GivePotionOnUserWithMagic(potionType, potionDuration, potionAmp) {
        this._type = potionType;
        this._duration = potionDuration;
        this._amp = potionAmp;
    }

    GivePotionOnUserWithMagic.prototype.touch = function (x, y, z, playerEntity) {
        Entity.addEffect(playerEntity, this._type, this._duration, this._amp, false, true);
    };



    /**
     * Behavior representing to give a potion effect on a victim with a sword.
     * @since 2016-10-26
     * @class
     * @implements {me.astro.weapon.behavior.IAttackBehavior}
     * @memberOf me.astro.weapon.behavior
     * @param {Number} potionType Type of the potion effect
     * @param {Number} potionDuration Duration of the potion effect
     * @param {Number} potionAmp Amplification of the potion effect
     */
    function GivePotionWithSword(potionType, potionDuration, potionAmp) {
        this._type = potionType;
        this._duration = potionDuration;
        this._amp = potionAmp;
    }

    GivePotionWithSword.prototype.attack = function (attacker, victim) {
        Entity.addEffect(victim, this._type, this._duration, this._amp, false, true);
    };



    /**
     * Behavior representing to place the blocks with a magic.
     * @since 2016-10-26
     * @class
     * @implements {me.astro.weapon.behavior.ITouchBehavior}
     * @memberOf me.astro.weapon.behavior
     * @param {Number} range Range of the magic
     * @param {Number} blockid ID of the block which will be placed by the magic
     * @param {Number} blockData Data ID of the block which will be placed by the magic
     */
    function SetBlockWithMagic(range, blockId, blockData) {
        this._range = range;
        this._blockId = blockId;
        this._blockData = blockData;
    }

    SetBlockWithMagic.prototype.touch = function (x1, y1, z1, playerEntity) {
        let range = this._range,
            blockId = this._blockId,
            blockData = this._blockData;
        for (let x = x1 - Math.floor(range / 2), maxX = x + Math.ceil(range / 2); x <= maxX; x++) {
            for (let y = y1 - Math.floor(range / 2), maxY = y + Math.ceil(range / 2); y <= maxY; y++) {
                for (let z = z1 - Math.floor(range / 2), maxZ = z + Math.ceil(range / 2); z <= maxZ; z++) {
                    Level.setTile(x, y, z, blockId, blockData);
                }
            }
        }
    };


    /**
     * Class representing a cooldown for weapons.
     * @since 2016-11-10
     * @class
     * @memberOf me.astro.weapon
     * @param {Number} time Sets How long you can't use same weapon again
     */
    function Cooldown(time) {
        this._available = true;
        this._time = time;
    }

    Cooldown.prototype.getTime = function () {
        return this._time;
    };

    Cooldown.prototype.isAvailable = function () {
        return this._available;
    };

    Cooldown.prototype.run = function () {
        let thiz = this;
        new Thread_({
            run() {
                thiz._available = false;
                Thread_.sleep(thiz._time * 1000);
                thiz._available = true;
            }
        }).start();
    };

    Cooldown.prototype.setAvailable = function (available) {
        this._available = available;
        return this;
    };

    Cooldown.prototype.setTime = function (time) {
        this._time = time;
        return this;
    };



    /**
     * Class representing a weapon.
     * @since 2016-10-26
     * @class
     * @memberOf me.astro.weapon
     * @param {Number} id ID of the item
     * @param {String} name Name of the item
     */
    function ItemCompat(id, name) {
        this._id = id;
        this._name = name;
        this._cooldown = null;
        this._iAttackBehavior = null;
        this._iTouchBehavior = null;
    }

    ItemCompat.prototype.getAttackBehavior = function () {
        return this._iAttackBehavior;
    };

    ItemCompat.prototype.getCooldown = function () {
        return this._cooldown;
    };

    ItemCompat.prototype.getId = function () {
        return this._id;
    };

    ItemCompat.prototype.getName = function () {
        return this._name;
    };

    ItemCompat.prototype.getTouchBehavior = function () {
        return this._iTouchBehavior;
    };

    ItemCompat.prototype.performAttack = function (attacker, victim) {
        let cooldown = this._cooldown,
            iAttackBehavior = this._iAttackBehavior;
        if (iAttackBehavior !== null) {
            if (cooldown === null) {
                iAttackBehavior.attack(attacker, victim);
            } else {
                if (cooldown.isAvailable()) {
                    iAttackBehavior.attack(attacker, victim);
                    cooldown.run();
                }
            }
        }
    };

    ItemCompat.prototype.performTouch = function (x, y, z, playerEntity) {
        let cooldown = this._cooldown,
            iTouchBehavior = this._iTouchBehavior;
        if (iTouchBehavior !== null) {
            if (cooldown === null) {
                iTouchBehavior.touch(x, y, z, playerEntity);
            } else {
                if (cooldown.isAvailable()) {
                    iTouchBehavior.touch(x, y, z, playerEntity);
                    cooldown.run();
                }
            }
        }
    };

    ItemCompat.prototype.setAttackBehavior = function (iAttackBehavior) {
        this._iAttackBehavior = iAttackBehavior;
        return this;
    };

    ItemCompat.prototype.setCooldown = function (cooldown) {
        this._cooldown = cooldown;
        return this;
    };

    ItemCompat.prototype.setId = function (id) {
        this._id = id;
        return this;
    };

    ItemCompat.prototype.setName = function (name) {
        this._name = name;
        return this;
    };

    ItemCompat.prototype.setTouchBehavior = function (iTouchBehavior) {
        this._iTouchBehavior = iTouchBehavior;
        return this;
    };



    /**
     * Class representing a block magic.
     * @since 2016-10-26
     * @class
     * @extends {me.astro.weapon.ItemCompat}
     * @memberOf me.astro.weapon
     * @param {Number} id ID of the item
     * @param {String} name Name of the item
     * @param {Number} range Range of the magic
     * @param {Number} blockid ID of the block which will be placed by the magic
     * @param {Number} blockData Data ID of the block which will be placed by the magic
     */
    function BlockMagic(id, name, range, blockId, blockData) {
        this._id = id;
        this._name = name;
        this._iAttackBehavior = null;
        this._iTouchBehavior = new SetBlockWithMagic(range, blockId, blockData);
    }

    BlockMagic.prototype = Object.create(ItemCompat.prototype);



    /**
     * Class representing a compound weapon.
     * @since 2016-10-26
     * @class
     * @extends {me.astro.weapon.ItemCompat}
     * @memberOf me.astro.weapon
     * @param {Number} id ID of the item
     * @param {String} name Name of the item
     * @param {me.astro.weapon.ItemCompat} attackWeapon Weapon which gives attack behavior
     * @param {me.astro.weapon.ItemCompat} touchWeapon Weapon which gives touch behavior
     */
    function CompoundWeapon(id, name, attackWeapon, touchWeapon) {
        this._id = id;
        this._name = name;
        this._iAttackBehavior = attackWeapon.getAttackBehavior();
        this._iTouchBehavior = touchWeapon.getTouchBehavior();
    }

    CompoundWeapon.prototype = Object.create(ItemCompat.prototype);



    /**
     * Class representing a explosion magic.
     * @since 2016-10-26
     * @class
     * @extends {me.astro.weapon.ItemCompat}
     * @memberOf me.astro.weapon
     * @param {Number} id ID of the item
     * @param {String} name Name of the item
     * @param {Number} range Range of the magic
     * @param {Boolean} onFire Explode with fire
     */
    function ExplosionMagic(id, name, range, onFire) {
        this._id = id;
        this._name = name;
        this._iAttackBehavior = null;
        this._iTouchBehavior = new ExplodeWithMagic(range, onFire);
    }

    ExplosionMagic.prototype = Object.create(ItemCompat.prototype);



    /**
     * Class representing a fire sword.
     * @since 2016-10-26
     * @class
     * @extends {me.astro.weapon.ItemCompat}
     * @memberOf me.astro.weapon
     * @param {Number} id ID of the item
     * @param {String} name Name of the item
     * @param {Number} damage Damage of the item
     */
    function FireSword(id, name, damage) {
        this._id = id;
        this._name = name;
        this._iAttackBehavior = new AttackFireWithSword(damage);
        this._iTouchBehavior = null;
    }

    FireSword.prototype = Object.create(ItemCompat.prototype);



    /**
     * Class representing a magic which gives potion effects on a target.
     * @since 2016-10-26
     * @class
     * @extends {me.astro.weapon.ItemCompat}
     * @memberOf me.astro.weapon
     * @param {Number} id ID of the item
     * @param {String} name Name of the item
     * @param {Number} range Range of the magic
     * @param {Number} potionType Type of the potion effect
     * @param {Number} potionDuration Duration of the potion effect
     * @param {Number} potionAmp Amplification of the potion effect
     */
    function PotionMagicOnTarget(id, name, range, potionType, potionDuration, potionAmp) {
        this._id = id;
        this._name = name;
        this._iAttackBehavior = null;
        this._iTouchBehavior = new GivePotionOnTargetWithMagic(range, potionType, potionDuration, potionAmp);
    }

    PotionMagicOnTarget.prototype = Object.create(ItemCompat.prototype);



    /**
     * Class representing a magic which gives potion effects on an user.
     * @since 2016-10-26
     * @class
     * @extends {me.astro.weapon.ItemCompat}
     * @memberOf me.astro.weapon
     * @param {Number} id ID of the item
     * @param {String} name Name of the item
     * @param {Number} potionType Type of the potion effect
     * @param {Number} potionDuration Duration of the potion effect
     * @param {Number} potionAmp Amplification of the potion effect
     */
    function PotionMagicOnUser(id, name, potionType, potionDuration, potionAmp) {
        this._id = id;
        this._name = name;
        this._iAttackBehavior = null;
        this._iTouchBehavior = new GivePotionOnUserWithMagic(potionType, potionDuration, potionAmp);
    }

    PotionMagicOnUser.prototype = Object.create(ItemCompat.prototype);



    /**
     * Class representing a sword which gives potion effect on victims.
     * @since 2016-10-26
     * @class
     * @extends {me.astro.weapon.ItemCompat}
     * @memberOf me.astro.weapon
     * @param {Number} id ID of the item
     * @param {String} name Name of the item
     * @param {Number} potionType Type of the potion effect
     * @param {Number} potionDuration Duration of the potion effect
     * @param {Number} potionAmp Amplification of the potion effect
     */
    function PotionSword(id, name, potionType, potionDuration, potionAmp) {
        this._id = id;
        this._name = name;
        this._iAttackBehavior = new GivePotionWithSword(potionType, potionDuration, potionAmp);
        this._iTouchBehavior = null;
    }

    PotionSword.prototype = Object.create(ItemCompat.prototype);



    /**
     * Class representing a sword.
     * @since 2016-10-26
     * @class
     * @extends {me.astro.weapon.ItemCompat}
     * @memberOf me.astro.weapon
     * @param {Number} id ID of the item
     * @param {String} name Name of the item
     * @param {Number} damage Damage of the item
     */
    function Sword(id, name, damage) {
        this._id = id;
        this._name = name;
        this._iAttackBehavior = new AttackWithSword(damage);
        this._iTouchBehavior = null;
    }

    Sword.prototype = Object.create(ItemCompat.prototype);



    let init = () => {
        new Thread_({
            run() {
                Thread_.sleep(3000);
                let scripts = ScriptManager_.scripts;
                for (let i = scripts.size(); i--;) {
                    ScriptableObject_.putProperty(scripts.get(i).scope, "me", me);
                }
                ScriptManager_.callScriptMethod("onLibraryLoaded", [NAME, NAME_CODE, VERSION]);
            }
        }).start();
    };

    astro.weapon = {
        behavior: {
            AttackFireWithSword: AttackFireWithSword,
            AttackWithSword: AttackWithSword,
            ExplodeWithMagic: ExplodeWithMagic,
            GivePotionOnTargetWithMagic: GivePotionOnTargetWithMagic,
            GivePotionOnUserWithMagic: GivePotionOnUserWithMagic,
            GivePotionWithSword: GivePotionWithSword,
            IAttackBehavior: IAttackBehavior,
            ITouchBehavior: ITouchBehavior,
            SetBlockWithMagic: SetBlockWithMagic
        },
        BlockMagic: BlockMagic,
        CompoundWeapon: CompoundWeapon,
        Cooldown: Cooldown,
        ExplosionMagic: ExplosionMagic,
        ItemCompat: ItemCompat,
        PotionMagicOnTarget: PotionMagicOnTarget,
        PotionMagicOnUser: PotionMagicOnUser,
        PotionSword: PotionSword,
        Sword: Sword
    };

    init();

})(this, (typeof me.astro === "object" ? me.astro : (me.astro = {})));