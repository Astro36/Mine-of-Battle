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
        this._iAttackBehavior = null;
        this._iTouchBehavior = null;
    }

    ItemCompat.prototype.getId = function () {
        return this._id;
    };

    ItemCompat.prototype.getName = function () {
        return this._name;
    };

    ItemCompat.prototype.performAttack = function (attacker, victim) {
        let iAttackBehavior = this._iAttackBehavior;
        if (iAttackBehavior !== null) {
            iAttackBehavior.attack(attacker, victim);
        }
    };

    ItemCompat.prototype.performTouch = function (x, y, z, playerEntity) {
        let iTouchBehavior = this._iTouchBehavior;
        if (iTouchBehavior !== null) {
            iTouchBehavior.touch(x, y, z, playerEntity);
        }
    };

    ItemCompat.prototype.setAttackBehavior = function (iAttackBehavior) {
        this._iAttackBehavior = iAttackBehavior;
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
        ExplosionMagic: ExplosionMagic,
        ItemCompat: ItemCompat,
        PotionMagicOnTarget: PotionMagicOnTarget,
        PotionMagicOnUser: PotionMagicOnUser,
        PotionSword: PotionSword,
        Sword: Sword
    };

    init();

})(this, (typeof me.astro === "object" ? me.astro : (me.astro = {})));