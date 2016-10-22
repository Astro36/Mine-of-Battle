"use strict";

const ITEM_NAMES = ["Ares", "Assassin", "Apollon", "Barbarian", "Stance", "Fighter", "Phoenix", "Fire Magicians", "Ice Magicians", "Riot Drinker"];

let items = [];



function ItemCompat(id, name) {
    this._id = id;
    this._name = name;
    this._cooldown = 0;
    this._available = true;
    this._damage = 0;
}

ItemCompat.prototype.getCooldown = function() {
    return this._cooldown;
};

ItemCompat.prototype.getDamage = function() {
    return this._damage;
};

ItemCompat.prototype.getId = function() {
    return this._id;
};

ItemCompat.prototype.getName = function() {
    return this._name;
};

ItemCompat.prototype.isAvailable = function() {
    return this._available;
};

ItemCompat.prototype.setCooldown = function(cooldown) {
    this._cooldown = cooldown;
    return this;
};

ItemCompat.prototype.setDamage = function(damage) {
    this._damage = damage;
    return this;
};

ItemCompat.prototype.setFunc = function(func) {
    this._func = func;
    return this;
};

ItemCompat.prototype.use = function(x, y, z, victim, user) {
    if (this._damage > 0) {
        Entity.setHealth(victim, Entity.getHealth(victim) - this._damage);
    }

    if (this._available) {
        this._available = false;

        if (typeof this._func === "function") {
            this._func(x, y, z, victim, user);
        }

        let thiz = this;
        if (thiz._cooldown > 0) {
            new java.lang.Thread({
                run() {
                    java.lang.Thread.sleep(thiz._cooldown * 1000);
                    thiz._available = true;
                }
            }).start();
        }
    }
};



function onUsedItemListener(x, y, z, victim, user, id) {
    for (let i = items.length; i--;) {
        let item = items[i];
        if (id === item.getId()) {
            item.use(x, y, z, victim, user);
        }
    }
}

function attackHook(attacker, victim) {
    let itemid = Player.getCarriedItem();
    if (itemid >= 600 && itemid < 620) {
        onUsedItemListener(Entity.getX(victim), Entity.getY(victim), Entity.getZ(victim), victim, attacker, itemid);
    }
}

function useItem(x, y, z, itemid) {
    if (itemid >= 600 && itemid < 620) {
        onUsedItemListener(x, y, z, null, Player.getEntity(), itemid);
    }
}

function init() {
    for (let i = 0; i < ITEM_NAMES.length; i++) {
        ModPE.setItem(i * 2 + 600, "map_empty", 0, ITEM_NAMES[i] + " I", 0);
        ModPE.setItem(i * 2 + 601, "map_empty", 0, ITEM_NAMES[i] + " II", 0);
    }

    // ["Ares", "Assassin", "Apollon", "Barbarian", "Stance", "Fighter", "Phoenix", "Fire Magicians", "Ice Magicians", "Riot Drinker"];

    items.push(new ItemCompat(600, "Ares I").setDamage(6));
    items.push(new ItemCompat(601, "Ares II").setDamage(8));

    items.push(new ItemCompat(602, "Assassin I")
        .setCooldown(25)
        .setDamage(3)
        .setFunc((x, y, z, victim, user) => {
            Enitity.addEffect(user, MobEffect.invisibility, 160, 0, false, true);
        }));
    items.push(new ItemCompat(603, "Assassin II")
        .setCooldown(20)
        .setDamage(6)
        .setFunc((x, y, z, victim, user) => {
            Enitity.addEffect(user, MobEffect.invisibility, 200, 0, false, true);
        }));

    items.push(new ItemCompat(604, "Apollon I"));
    items.push(new ItemCompat(605, "Apollon II"));

    items.push(new ItemCompat(606, "Barbarian I").setDamage(4)
        .setFunc((x, y, z, victim, user) => {
            Enitity.addEffect(user, MobEffect.movementSpeed, 600, 1, false, true);
        }));
    items.push(new ItemCompat(607, "Barbarian II")
        .setDamage(200)
        .setFunc((x, y, z, victim, user) => {
            Enitity.addEffect(user, MobEffect.damageBoost, 200, 1, false, true);
            Enitity.addEffect(user, MobEffect.damageResistance, 200, 1, false, true);
            Enitity.addEffect(user, MobEffect.regeneration, 200, 1, false, true);
            Enitity.addEffect(user, MobEffect.absorption, 200, 1, false, true);
        }));

    items.push(new ItemCompat(608, "Stance I"));
    items.push(new ItemCompat(609, "Stance II")
        .setFunc((x, y, z, victim, user) => {
            Enitity.addEffect(victim, MobEffect.poison, 200, 0, false, true);
        }));

    items.push(new ItemCompat(610, "Fighter I").setDamage(4));
    items.push(new ItemCompat(611, "Fighter II")
        .setCooldown(45)
        .setDamage(4)
        .setFunc((x, y, z, victim, user) => {
            Entity.setVelY(victim, 10);
        }));

    items.push(new ItemCompat(612, "Phoenix I").setDamage(2)
        .setFunc((x, y, z, victim, user) => {
            Enitity.addEffect(user, MobEffect.damageResistance, 600, 1, false, true);
            Enitity.addEffect(user, MobEffect.regeneration, 600, 0, false, true);
        }));
    items.push(new ItemCompat(613, "Phoenix II").setDamage(3)
        .setFunc((x, y, z, victim, user) => {
            Entity.setFireTicks(victim, 1);
            Entity.setHealth(user, Entity.getHealth(user) + 1);
        }));

    items.push(new ItemCompat(614, "Fire Magicians I").setDamage(2)
        .setCooldown(30)
        .setFunc((x, y, z, victim, user) => {

        }));
    items.push(new ItemCompat(615, "Fire Magicians II").setDamage(4)
        .setCooldown(50)
        .setFunc((x, y, z, victim, user) => {
            Level.explode(x, y, z, 3, true);
        }));

    items.push(new ItemCompat(616, "Ice Magicians I").setDamage(2)
        .setFunc((x, y, z, victim, user) => {
            Enitity.addEffect(user, MobEffect.movementSlowdown, 200, 0, false, true);
        }));
    items.push(new ItemCompat(617, "Ice Magicians II").setDamage(4)
        .setCooldown(50)
        .setFunc((x, y, z, victim, user) => {
            new java.lang.Thread({
                run() {
                    Level.setTile(x - 1, y, z + 1, 79, 0);
                    Level.setTile(x - 1, y, z, 79, 0);
                    Level.setTile(x - 1, y, z - 1, 79, 0);
                    Level.setTile(x, y, z + 1, 79, 0);
                    Level.setTile(x, y, z, 79, 0);
                    Level.setTile(x, y, z - 1, 79, 0);
                    Level.setTile(x + 1, y, z + 1, 79, 0);
                    Level.setTile(x + 1, y, z, 79, 0);
                    Level.setTile(x + 1, y, z - 1, 79, 0);
                    Level.setTile(x - 1, y + 1, z + 1, 79, 0);
                    Level.setTile(x - 1, y + 1, z, 79, 0);
                    Level.setTile(x - 1, y + 1, z - 1, 79, 0);
                    Level.setTile(x, y + 1, z + 1, 79, 0);
                    Level.setTile(x, y + 1, z, 79, 0);
                    Level.setTile(x, y + 1, z - 1, 79, 0);
                    Level.setTile(x + 1, y + 1, z + 1, 79, 0);
                    Level.setTile(x + 1, y + 1, z, 79, 0);
                    Level.setTile(x + 1, y + 1, z - 1, 79, 0);
                    Level.setTile(x - 1, y + 2, z + 1, 79, 0);
                    Level.setTile(x - 1, y + 2, z, 79, 0);
                    Level.setTile(x - 1, y + 2, z - 1, 79, 0);
                    Level.setTile(x, y + 2, z + 1, 79, 0);
                    Level.setTile(x, y + 2, z, 79, 0);
                    Level.setTile(x, y + 2, z - 1, 79, 0);
                    Level.setTile(x + 1, y + 2, z + 1, 79, 0);
                    Level.setTile(x + 1, y + 2, z, 79, 0);
                    Level.setTile(x + 1, y + 2, z - 1, 79, 0);
                    java.lang.Thread.sleep(5000);
                    Level.setTile(x - 1, y, z + 1, 0, 0);
                    Level.setTile(x - 1, y, z, 0, 0);
                    Level.setTile(x - 1, y, z - 1, 0, 0);
                    Level.setTile(x, y, z + 1, 0, 0);
                    Level.setTile(x, y, z, 0, 0);
                    Level.setTile(x, y, z - 1, 0, 0);
                    Level.setTile(x + 1, y, z + 1, 0, 0);
                    Level.setTile(x + 1, y, z, 0, 0);
                    Level.setTile(x + 1, y, z - 1, 0, 0);
                    Level.setTile(x - 1, y + 1, z + 1, 0, 0);
                    Level.setTile(x - 1, y + 1, z, 0, 0);
                    Level.setTile(x - 1, y + 1, z - 1, 0, 0);
                    Level.setTile(x, y + 1, z + 1, 0, 0);
                    Level.setTile(x, y + 1, z, 0, 0);
                    Level.setTile(x, y + 1, z - 1, 0, 0);
                    Level.setTile(x + 1, y + 1, z + 1, 0, 0);
                    Level.setTile(x + 1, y + 1, z, 0, 0);
                    Level.setTile(x + 1, y + 1, z - 1, 0, 0);
                    Level.setTile(x - 1, y + 2, z + 1, 0, 0);
                    Level.setTile(x - 1, y + 2, z, 0, 0);
                    Level.setTile(x - 1, y + 2, z - 1, 0, 0);
                    Level.setTile(x, y + 2, z + 1, 0, 0);
                    Level.setTile(x, y + 2, z, 0, 0);
                    Level.setTile(x, y + 2, z - 1, 0, 0);
                    Level.setTile(x + 1, y + 2, z + 1, 0, 0);
                    Level.setTile(x + 1, y + 2, z, 0, 0);
                    Level.setTile(x + 1, y + 2, z - 1, 0, 0);
                }
            }).start();
        }));

    items.push(new ItemCompat(618, "Riot Drinker I").setDamage(4));
    items.push(new ItemCompat(619, "Riot Drinker II")
        .setCooldown(30
            .setFunc((x, y, z, victim, user) => {
                Level.explode(x, y, z, 4);
            }));
    }

    init();
