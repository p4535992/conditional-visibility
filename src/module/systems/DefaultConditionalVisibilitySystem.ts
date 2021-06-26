import { i18n } from "../../conditional-visibility";
import { ConditionalVisibilityFacade } from "../ConditionalVisibilityFacade";
import { DEFAULT_STEALTH, StatusEffect } from "../settings";
import { ConditionalVisibilitySystem } from "./ConditionalVisibilitySystem";
const MODULE_NAME = "conditional-visibility";
/**
 * The DefaultConditionalVisibilitySystem, to use when no visibility system can be found for the game system.
 */
export class DefaultConditionalVisibilitySystem implements ConditionalVisibilitySystem {

    BASE_EFFECTS = new Array<StatusEffect> (
        {
            id: MODULE_NAME + '.invisible',
            visibilityId: 'invisible',
            label:  game.i18n.localize(MODULE_NAME+'.invisible'),
            icon:'modules/'+MODULE_NAME+'/icons/unknown.svg'
        }, {
            id: MODULE_NAME + '.obscured',
            visibilityId: 'obscured',
            label:  game.i18n.localize(MODULE_NAME+'.obscured'),
            icon: 'modules/'+MODULE_NAME+'/icons/foggy.svg',
         }, {
            id: MODULE_NAME + '.indarkness',
            visibilityId: 'indarkness',
            label:  game.i18n.localize(MODULE_NAME+'.indarkness'),
            icon: 'modules/'+MODULE_NAME+'/icons/moon.svg'
        }
    );

    _effectsByIcon: Map<string, StatusEffect>;
    _effectsByCondition: Map<string, StatusEffect>;

    // hasStatus(token:Token, id:string, icon:string): boolean {
    //     return token.data.actorLink ? token.actor?.data?.flags?.[MODULE_NAME]?.[id] === true : token.data?.flags?.[MODULE_NAME]?.[id] === true;
    // }

    constructor() {
        //yes, this is a BiMap but the solid TS BiMap implementaiton is GPLv3, so we will just fake what we need here
        this._effectsByIcon = new Map<string, StatusEffect>();
        this._effectsByCondition = new Map<string, StatusEffect>();
        this.effects().forEach(statusEffect => {
            this._effectsByIcon.set(statusEffect.icon, statusEffect);
            this._effectsByCondition.set(statusEffect.visibilityId, statusEffect);
        });
    }

    async onCreateActiveEffect(effect, options, userId) {
        const status = this.getEffectByIcon(effect);
        if (status) {
            const actor = effect.parent;
            await actor.setFlag(MODULE_NAME, status.visibilityId, true);
        }
    }

    async onDeleteActiveEffect(effect, options, userId) {
        const status = this.getEffectByIcon(effect);
        if (status) {
            const actor = effect.parent;
            await actor.unsetFlag(MODULE_NAME, status.visibilityId, true);
        }
    }

    hasStatus(token, id) {
        return token.actor?.data?.flags?.[MODULE_NAME]?.[id] === true || token.data?.flags?.[MODULE_NAME]?.[id] === true;
    }

    gameSystemId(): string {
        return "default";
    }
    /**
     * Base effects are invisible, obscured, and indarkness
     */
    effects():Array<StatusEffect> {
        return this.BASE_EFFECTS;
    }

    effectsByIcon(): Map<string, StatusEffect> {
        return this._effectsByIcon;
    }

    effectsByCondition(): Map<string, StatusEffect> {
        return this._effectsByCondition;
    }

    effectsFromUpdate(update: any):any {
        return update.actorData?.effects;
    }

    getEffectByIcon(effect):StatusEffect {
        //@ts-ignore
        if(!effect.data?.icon){
        return this.effectsByIcon().get(effect.icon);
        }
        return this.effectsByIcon().get(effect.data?.icon);
    }

    initializeStatusEffects() {
        console.log(MODULE_NAME + " | Initializing visibility system effects " + this.gameSystemId() + " for game system " + game.system.id);
        this.effectsByIcon().forEach((value: StatusEffect, key: string) => {
            //@ts-ignore
            CONFIG.statusEffects.push({
                id: value.id,
                label: value.label,
                icon: value.icon
            });

        });
    }
    /**
     * For subclasses to set up systsem specific hooks.
     * @todo unify initializeOnToggleEffect if possible
     */
    initializeHooks(facade:ConditionalVisibilityFacade): void {
    }

    /**
     * Default system does not have any reaction to a condition change.  Subclasses override this to add behavior.
     * @param tokenHud the tokenHud to use
     */
    initializeOnToggleEffect(tokenHud: any) {
    }

    getVisionCapabilities(srcTokens: Token[]) {
        const flags: any = {};
        flags.seeinvisible = srcTokens.some(sTok => {
            return sTok.data.flags[MODULE_NAME] &&
                //@ts-ignore
                (sTok.data.flags[MODULE_NAME].seeinvisible === true
                //@ts-ignore
                || sTok.data.flags[MODULE_NAME].blindsight === true
                //@ts-ignore
                || sTok.data.flags[MODULE_NAME].tremorsense === true
                //@ts-ignore
                || sTok.data.flags[MODULE_NAME].truesight === true);
        });
        flags.seeobscured = srcTokens.some(sTok => {
            return sTok.data.flags[MODULE_NAME] &&
                //@ts-ignore
                (sTok.data.flags[MODULE_NAME].blindsight === true
                //@ts-ignore
                || sTok.data.flags[MODULE_NAME].tremorsense === true);
        });
        flags.seeindarkness = srcTokens.some(sTok => {
            return sTok.data.flags[MODULE_NAME] &&
                //@ts-ignore
                (sTok.data.flags[MODULE_NAME].blindsight === true
                //@ts-ignore
                || sTok.data.flags[MODULE_NAME].devilssight === true
                //@ts-ignore
                || sTok.data.flags[MODULE_NAME].tremorsense === true
                //@ts-ignore
                || sTok.data.flags[MODULE_NAME].truesight === true);
        });
        return flags;
    }

    /**
     * The base method comparing the capability flags from the sightLayer with the conditions of the token.
     * @param target the token whose visibility is being checked
     * @param flags the capabilities established by the sight layer
     */
    canSee(target: Token, visionCapabilities: any): boolean {
        if (this.seeInvisible(target, visionCapabilities) === false) {
            return false;
        }

        if (this.seeObscured(target, visionCapabilities) === false) {
            return false;
        }

        if (this.seeInDarkness(target, visionCapabilities) === false) {
            return false;
        }

        if (this.seeContested(target, visionCapabilities) === false) {
            return false;
        }
        return true;

    }

    /**
     * Tests whether a token is invisible, and if it can be seen.
     * @param target the token being seen (or not)
     * @param effects the effects of that token
     * @param visionCapabilities the sight capabilities of the sight layer
     */
    seeInvisible(target:Token, visionCapabilities:any): boolean {
        const invisible = this.hasStatus(target, 'invisible');
        if (invisible === true) {
            if (visionCapabilities.seeinvisible !== true) {
                return false;
            }
        }
        return true;
    }

    /**
     * Tests whether a token is obscured, and if it can be seen.
     * @param target the token being seen (or not)
     * @param visionCapabilities the sight capabilities of the sight layer
     */
    seeObscured(target:Token, visionCapabilities:any): boolean {
        const obscured = this.hasStatus(target, 'obscured');
        if (obscured === true) {
            if (visionCapabilities.seeobscured !== true) {
                return false;
            }
        }
        return true;
    }

    /**
     * Tests whether a token is in darkness, and if it can be seen.
     * @param target the token being seen (or not)
     * @param effects the effects of that token
     * @param flags the sight capabilities of the sight layer
     */
    seeInDarkness(target:Token, visionCapabilities:any): boolean {
        const indarkness = this.hasStatus(target, 'indarkness');
        if (indarkness === true) {
            if (visionCapabilities.seeindarkness !== true) {
                return false;
            }
        }
        return true;
    }

    /**
     * Tests whether a token has some contested (hidden) condition, and if it can be seen.  The most likely
     * candidate to be overridden by sublass systems.
     * @param target the token being seen (or not)
     * @param effects the effects of that token
     * @param visionCapabilities the sight capabilities of the sight layer
     */
    seeContested(target:Token, flags:any): boolean {
        return true;
    }

    hasStealth() {
        return false;
    }

    /**
     * Roll for the contested hiding check; override in subclass systems
     * @param token the token whose stats may create the roll.
     * @return a Roll
     */
    rollStealth(token:Token):Roll {
        return new Roll("1d20");
    }

    /**
     * Renders a dialog window pre-filled with the result of a system-dependent roll, which can be changed in an input field.  Subclasses can use this
     * as is, see ConditionalVisibilitySystem5e for an example
     * @param token the actor to whom this dialog refers
     * @returns a Promise<number> containing the value of the result, or -1 if unintelligble
     */
    async stealthHud(token) {
        let initialValue;
        try {
            initialValue = parseInt(token.data.flags[MODULE_NAME]._ste);
        }
        catch (err) {
        }
        let result = initialValue;
        if (initialValue === undefined || isNaN(parseInt(initialValue))) {
            try {
                result = this.rollStealth(token).roll().total;
            }
            catch (err) {
                console.warn("Error rolling stealth, check formula for system");
                result = DEFAULT_STEALTH;
            }
        }
        const content = await renderTemplate("modules/" + MODULE_NAME + "/templates/stealth_hud.html", { initialValue: result });
        return new Promise((resolve, reject) => {
            let hud = new Dialog({
                title: game.i18n.localize(MODULE_NAME + '.hidden'),
                content: content,
                buttons: {
                    one: {
                        icon: '<i class="fas fa-check"></i>',
                        label: 'OK',
                        callback: (html) => {
                            //@ts-ignore
                            const val = parseInt(html.find('div.form-group').children()[1].value);
                            if (isNaN(val)) {
                                resolve(-1);
                            }
                            else {
                                resolve(val);
                            }
                        }
                    }
                },
                close: (html) => {
                    //@ts-ignore
                    const val = parseInt(html.find('div.form-group').children()[1].value);
                    if (isNaN(val)) {
                        resolve(-1);
                    }
                    else {
                        resolve(val);
                    }
                },
                default: ""
            });
            hud.render(true);
        });
    }
}