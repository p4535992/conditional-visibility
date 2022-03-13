import { ConditionalVisibilityEffectDefinitions } from '../conditional-visibility-effect-definition';
import { AtcvEffectSenseFlags, AtcvEffectConditionFlags, SenseData } from '../conditional-visibility-models';
import CONSTANTS from '../constants';

export default {
  HP_ATTRIBUTE: 'data.attributes.hp.value',
  PERCEPTION_PASSIVE_SKILL: `data.skills.prc.passive`,
  STEALTH_PASSIVE_SKILL: `data.skills.ste.passive`,
  STEALTH_ACTIVE_SKILL: `data.skills.ste.total`,
  STEALTH_ID_SKILL: `ste`,
  NPC_TYPE: `npc`,
  SENSES: <SenseData[]>[
    {
      id: AtcvEffectSenseFlags.NONE,
      name: `${CONSTANTS.MODULE_NAME}.${AtcvEffectSenseFlags.NONE}`,
      path: '',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/light_01.jpg`,
      //effect: undefined,
      visionLevelMinIndex: -2,
      visionLevelMaxIndex: -1,
      conditionElevation: false,
    },
    {
      id: AtcvEffectSenseFlags.NORMAL,
      name: `${CONSTANTS.MODULE_NAME}.${AtcvEffectSenseFlags.NORMAL}`,
      path: 'data.traits.senses.blinded',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/light_02.jpg`,
      //effect: EffectDefinitions.blinded(0),
      visionLevelMinIndex: 0,
      visionLevelMaxIndex: 1,
      conditionElevation: false,
    },
    {
      id: AtcvEffectSenseFlags.BLINDED,
      name: `${CONSTANTS.MODULE_NAME}.${AtcvEffectSenseFlags.BLINDED}`,
      path: 'data.traits.senses.blinded',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/affliction_24.jpg`,
      //effect: EffectDefinitions.blinded(0),
      visionLevelMinIndex: -1,
      visionLevelMaxIndex: 0,
      conditionElevation: false,
    },
    {
      id: AtcvEffectSenseFlags.LOW_LIGHT_VISION,
      name: `${CONSTANTS.MODULE_NAME}.${AtcvEffectSenseFlags.LOW_LIGHT_VISION}`,
      path: 'data.traits.senses.lowlightvision',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/violet_09.jpg`,
      //effect: EffectDefinitions.lowlightvision(0),
      visionLevelMinIndex: 0,
      visionLevelMaxIndex: 2,
      conditionElevation: false,
    },
    {
      id: AtcvEffectSenseFlags.DARKVISION,
      name: `${CONSTANTS.MODULE_NAME}.${AtcvEffectSenseFlags.DARKVISION}`,
      path: 'data.traits.senses.darkvision',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/evil-eye-red-1.jpg`,
      //effect: EffectDefinitions.darkvision(0),
      visionLevelMinIndex: 0,
      visionLevelMaxIndex: 3,
      conditionElevation: false,
    },
    {
      id: AtcvEffectSenseFlags.GREATER_DARKVISION,
      name: `${CONSTANTS.MODULE_NAME}.${AtcvEffectSenseFlags.GREATER_DARKVISION}`,
      path: 'data.traits.senses.greaterdarkvision',
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/ae/evil-eye-eerie-1.jpg`,
      //effect: EffectDefinitions.darkvision(120),
      visionLevelMinIndex: 0,
      visionLevelMaxIndex: 4,
      conditionElevation: false,
    },
  ],
  CONDITIONS: <SenseData[]>[
    // {
    //   id: AtcvEffectConditionFlags.STEALTHED,
    //   name: `${CONSTANTS.MODULE_NAME}.${AtcvEffectConditionFlags.STEALTHED}`,
    //   path: ``, //`data.skills.ste.passive`,
    //   img: `modules/${CONSTANTS.MODULE_NAME}/icons/blue_35.jpg`,
    //   visionLevelMinIndex: 0,
    //   visionLevelMaxIndex: 1,
    //   conditionElevation: false,
    // },
    {
      id: AtcvEffectConditionFlags.HIDDEN,
      name: `${CONSTANTS.MODULE_NAME}.${AtcvEffectConditionFlags.HIDDEN}`,
      path: ``, //`data.skills.ste.passive`,
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/newspaper.jpg`,
      visionLevelMinIndex: 0,
      visionLevelMaxIndex: 1,
      conditionElevation: false,
    },
    {
      id: AtcvEffectConditionFlags.INVISIBLE,
      name: `${CONSTANTS.MODULE_NAME}.${AtcvEffectConditionFlags.INVISIBLE}`,
      path: undefined,
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/unknown.jpg`,
      visionLevelMinIndex: 0,
      visionLevelMaxIndex: 4,
      conditionElevation: false,
    },
    {
      id: AtcvEffectConditionFlags.OBSCURED,
      name: `${CONSTANTS.MODULE_NAME}.${AtcvEffectConditionFlags.OBSCURED}`,
      path: undefined,
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/foggy.jpg`,
      visionLevelMinIndex: 0,
      visionLevelMaxIndex: 6,
      conditionElevation: false,
    },
    {
      id: AtcvEffectConditionFlags.IN_DARKNESS,
      name: `${CONSTANTS.MODULE_NAME}.${AtcvEffectConditionFlags.IN_DARKNESS}`,
      path: undefined,
      img: `modules/${CONSTANTS.MODULE_NAME}/icons/moon.jpg`,
      visionLevelMinIndex: 0,
      visionLevelMaxIndex: 6,
      conditionElevation: false,
    },
  ],
};
