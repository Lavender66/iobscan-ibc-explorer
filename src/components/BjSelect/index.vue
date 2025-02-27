<template>
    <a-dropdown
        v-model:visible="visible"
        :trigger="['click']"
        :overlay-style="{ zIndex: 1020 }"
        :destroy-popup-on-hide="true"
        :get-popup-container="dropdownProps?.getPopupContainer"
        @visible-change="visibleChange"
    >
        <div
            class="flex items-center default_color dropdown_container cursor"
            :class="[{ visible_border: visible }]"
        >
            <!--            多选单选的展示 start-->
            <template v-if="props.mode !== MODES.double">
                <show-base
                    :visible="visible"
                    :select-items="selectItems"
                    :placeholder="placeholder"
                    :hide-icon="hideIcon"
                    :mode="props.mode"
                    :select-color-default-val="selectColorDefaultVal"
                />
            </template>
            <!--            多选单选的展示 end-->
            <!--            只选择两个时候的展示 start-->
            <template v-else>
                <show-double
                    :visible="visible"
                    :select-items="selectItems"
                    :placeholders="props.placeholders"
                    :hide-icon="hideIcon"
                    :select-color-default-val="selectColorDefaultVal"
                />
            </template>
            <!--            只选择两个时候的展示 end-->
            <span class="button_icon flex justify-between items-center">
                <i
                    :class="[visible ? 'visible_color' : '']"
                    class="iconfont icon-zhankai-copy-icon"
                    :style="{
                        transform: visible ? 'rotate(180deg)' : 'rotate(0)'
                    }"
                ></i>
            </span>
        </div>

        <template #overlay>
            <div class="overlay">
                <div
                    v-for="(group, ind) in props.data"
                    :key="group.groupName"
                    :class="[group.groupName ? 'mb-20' : 'mb-12']"
                >
                    <div v-if="group.groupName" class="flex items-center">
                        <div class="title">{{ group.groupName }}</div>
                        <a-popover
                            v-if="group.tooltips"
                            destroy-tooltip-on-hide
                            overlay-class-name="antd-popover"
                        >
                            <template #content>
                                <p class="confirm_button">
                                    {{ group.tooltips }}
                                </p>
                            </template>
                            <img
                                v-if="group.icon"
                                class="tip cursor"
                                style="margin-left: 8px"
                                :src="group.icon"
                            />
                        </a-popover>
                    </div>
                    <div class="relative">
                        <div
                            :class="{
                                top_shadow: isBoundary[ind]?.top
                            }"
                        ></div>
                        <div class="chains_wrap ibc_scrollbar">
                            <div
                                v-for="item in group?.children"
                                :key="item.id"
                                :class="[
                                    'chains_tag',
                                    'cursor',
                                    {
                                        'visible_color visible_border selected': isSelected(
                                            item.id
                                        ),
                                        disabled: item.disabled
                                    }
                                ]"
                                @click="onSelected(item)"
                            >
                                <img
                                    v-if="item?.icon"
                                    :src="item.icon"
                                    width="24"
                                    height="24"
                                    class="mr-8"
                                />
                                <span class="symbol">{{ item.title }}</span>
                                <div
                                    v-if="badges && getBadgeStr(item.id)"
                                    class="chains_tag__badge"
                                >
                                    {{ getBadgeStr(item.id) }}
                                </div>
                            </div>
                        </div>
                        <div
                            :class="{
                                bottom_shadow: isBoundary[ind]?.bottom
                            }"
                        ></div>
                    </div>
                </div>
                <div v-if="inputCtn" class="mt-24">
                    <div v-if="inputCtn?.title" class="flex items-center">
                        <div class="leading-none">{{ inputCtn?.title }}</div>
                        <a-popover
                            v-if="inputCtn.toolTip"
                            destroy-tooltip-on-hide
                            overlay-class-name="antd-popover"
                        >
                            <template #content>
                                <p class="tip__color">
                                    {{ inputCtn.toolTip }}
                                </p>
                            </template>
                            <img
                                v-if="inputCtn.icon"
                                class="tip cursor"
                                style="margin-left: 8px"
                                :src="inputCtn.icon"
                            />
                        </a-popover>
                    </div>
                    <div class="flex items-center mt-12 flex-wrap">
                        <a-input
                            v-model:value="tokenInput"
                            allow-clear
                            class="token_input"
                            :placeholder="inputCtn.placeholder"
                            @input="onInputChange"
                        />
                        <a-button type="primary" class="confirm_button ml-12" @click="confirmChains"
                            >{{ inputCtn.btnTxt }}
                        </a-button>
                    </div>
                </div>
            </div>
        </template>
    </a-dropdown>
</template>
<script lang="ts" setup>
    import { DropdownProps } from 'ant-design-vue/es/dropdown';
    import { IDataItem, TDenom, TData } from './interface';
    import { useInit } from './composable';
    import { getValByMode, closeByMode, inputItemsByMode, getLastArrs } from './helper';
    import { MODES } from './constants';

    /**
     * defineProps 使用外部引入的interface或者type会报错
     */
    export interface IProps {
        data: TData;
        // ux交互：选中时候展示default颜色。
        selectColorDefaultVal?: string | number | (string | number)[];
        inputFlag?: boolean;
        changeInputFlag?: (flag: boolean) => void;
        value?: string | number | (string | number)[];
        mode?: MODES.multiple | MODES.double;
        placeholder?: string;
        hideIcon?: boolean;
        associateId?: string | number; // 双选时候，input输入时候一个值时候，另外展示的值
        badges?: [string, string];
        placeholders?: [string, string];
        inputCtn?: {
            title?: string;
            icon?: string;
            toolTip?: string;
            placeholder?: string;
            btnTxt: string;
        };
        dropdownProps?: DropdownProps;
    }

    const props = withDefaults(defineProps<IProps>(), {
        data: () => []
    });

    const { inputCtn, placeholder, hideIcon, badges, selectColorDefaultVal, dropdownProps } = {
        ...props
    };

    const { visible, selectItems, tokenInput, flatData, resetVal } = useInit(props);

    // 是否选中
    const isSelected = (val: TDenom) =>
        selectItems.value.some((v) => v.id === val && !props.inputFlag);

    // 获取badges
    const getBadgeStr = (val: TDenom) => {
        const isDouble = selectItems.value.filter((v) => v.id === val)?.length === 2;

        if (isDouble) {
            return props.badges!.join('-');
        }

        const index = selectItems.value.findIndex((v) => v.id === val);
        if (index !== -1) {
            return props.badges![index];
        }
    };

    const emit = defineEmits<{
        // (e: 'onChange', res?: IDataItem | IDataItem[]): void;
        (e: 'onChange', res: any): void;
    }>();

    /**
     * @param selectData 选中的数据
     * @param close 是否收起关闭，默认不关闭，通过closeByMode函数判断
     */
    const sumbitTokens = (selectData: IDataItem[], close = false) => {
        let res = getValByMode(selectData, props.mode);
        if (
            props.mode !== MODES.double ||
            (props.mode === MODES.double && selectData.length === 2)
        ) {
            emit('onChange', res);
            if (close || closeByMode(selectData, props.mode)) {
                visible.value = false;
            }
        }
    };

    // 确认confirm时候
    const confirmChains = () => {
        const inputItems = inputItemsByMode(tokenInput.value, props.mode);

        // 双选时候，如果选择框没有值时候希望填充
        if (props.mode === MODES.double && inputItems.length === 0) {
            const matchItem: IDataItem | undefined = flatData.value.find(
                (v) => v.id === props.associateId
            );

            if (matchItem) {
                selectItems.value = [matchItem, matchItem];
            }
        }
        sumbitTokens(selectItems.value, true);
    };

    // 监听滚动
    const isBoundary = ref<
        {
            top?: boolean;
            bottom?: boolean;
        }[]
    >([]);
    const eleRef = ref();
    const scrollFn = (visible: boolean) => {
        if (visible) {
            isBoundary.value = [];
            // 加上延迟是因为，打开之后就直接返回visible了，但是收起来之后才会返回visible。
            setTimeout(() => {
                eleRef.value = document.querySelectorAll('.chains_wrap');
                Array.prototype.forEach.call(eleRef.value, (ele: HTMLElement, ind: number) => {
                    isBoundary.value[ind] = {};
                    ele.addEventListener('scroll', () => {
                        isBoundary.value[ind].top = ele.scrollTop !== 0;
                        if (ele.scrollHeight === ele.scrollTop + ele.clientHeight) {
                            isBoundary.value[ind].bottom = false;
                        } else {
                            isBoundary.value[ind].bottom = true;
                        }
                    });
                });
            }, 600);
        } else {
            Array.prototype.forEach.call(eleRef.value, (ele: HTMLElement) => {
                ele.removeEventListener('scroll', () => {});
            });
        }
    };

    const visibleChange = (visible: boolean) => {
        // 收起展开时候都重新赋值
        resetVal(props.value, props.inputFlag);

        // 监听一些滚动，只是为了加阴影
        scrollFn(visible);
    };

    const onInputChange = () => {
        props.changeInputFlag && props.changeInputFlag(true);
        let res: IDataItem[] = [];
        const inputItems = inputItemsByMode(tokenInput.value, props.mode);

        switch (props.mode) {
            // 多选时候都输出
            case MODES.multiple:
                res = getLastArrs([...selectItems.value, ...inputItems]);
                break;
            // 只选择两个时候
            case MODES.double:
                // 输入框作为选择项
                res = getLastArrs(inputItems).slice(0, 2);
                const matchItem = flatData.value.find((v) => v.id === props.associateId);
                // 填充选项，选中all，这里作为配置项传进来。
                if (inputItems.length === 1) {
                    if (matchItem) {
                        res = [...inputItems, matchItem] as IDataItem[];
                    }
                } else if (inputItems.length === 0) {
                    res = [matchItem, matchItem] as IDataItem[];
                }
                break;
            default:
                // 单选时候，清空选择框
                res = getLastArrs(inputItems);
                break;
        }

        selectItems.value = res;
    };

    const onSelected = (item: IDataItem) => {
        if (item.disabled) {
            return;
        }

        selectByMode();

        sumbitTokens(selectItems.value);

        // 写成内联函数形式，只是为了减少onSelected主体代码。
        function selectByMode() {
            let index;
            switch (props.mode) {
                case MODES.multiple:
                    // 多选时候，有取消操作
                    index = selectItems.value.findIndex((v) => v.id === item.id);
                    if (index === -1) {
                        selectItems.value.push(item);
                    } else {
                        selectItems.value = [
                            ...selectItems.value.slice(0, index),
                            ...selectItems.value.slice(index + 1)
                        ];
                    }
                    break;
                // 只选择两个时候, 清空input, 超过两个重选
                case MODES.double:
                    if (selectItems.value.length >= 2) {
                        selectItems.value = [item];
                        tokenInput.value = '';
                    } else {
                        index = selectItems.value.findIndex((v) => v.id === item.id);
                        // 可以选择自己两次的，比如all选项
                        if (index === -1 || item.doubleTime) {
                            selectItems.value.push(item);
                        }
                    }
                    break;
                default:
                    // 单选时候，选择和输入只能有一个，所以清除input输入
                    selectItems.value = [item];
                    tokenInput.value = '';
            }
        }
    };
</script>

<style lang="less" scoped>
    .top_shadow {
        position: absolute;
        width: 100%;
        height: 30px;
        pointer-events: none;
        z-index: 1;
        background: linear-gradient(180deg, rgba(17, 22, 77, 0.05) 0%, rgba(255, 255, 255, 0) 100%);
        // box-shadow: inset 0 10px 8px -8px #00000026;
        // margin-top: -10px;
    }
    .bottom_shadow {
        position: absolute;
        width: 100%;
        height: 30px;
        pointer-events: none;
        z-index: 1;
        background: linear-gradient(360deg, rgba(17, 22, 77, 0.05) 0%, rgba(255, 255, 255, 0) 100%);
        transform: translateY(-100%);
        margin-top: 10px;
        //box-shadow: inset 0 -10px 8px -8px #00000026;
    }
    .dropdown_container {
        height: 36px;
        border: 1px solid var(--bj-border-color);
        border-radius: 4px;
        background-color: #fff;
        min-width: 124px;
    }

    .button_icon {
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        padding: 0 2px;
        border-left: 1px solid var(--bj-border-color);
        height: 34px;

        .iconfont {
            font-size: 18px;
            color: var(--bj-text-third);
        }
    }

    .visible_border {
        border: 1px solid var(--bj-primary-color) !important;
        box-shadow: 0 0 0 2px rgb(61 80 255 / 20%);
    }

    .visible_color {
        color: var(--bj-primary-color) !important;
    }

    .default_color {
        color: var(--bj-text-second);
        &:hover {
            border-color: var(--bj-primary-color);
        }
    }

    .multiple {
        border: 1px solid var(--bj-primary-color);
        margin: 2px;
        padding: 0 10px;
        border-radius: 4px;
    }

    .overlay {
        max-width: 872px;
        background: #ffffff;
        box-shadow: 0px 2px 8px 0px #d9deec;
        border-radius: 4px;
        min-height: 200px;
        border: 1px solid var(--bj-border-color);
        padding: 16px 4px 24px 16px;
        transition: all 0.5s cubic-bezier(0.645, 0.045, 0.355, 1);
    }

    .title {
        margin-bottom: 12px;
    }

    .chains_wrap {
        //display: grid;
        //grid-template-columns: repeat(auto-fill, 158px);
        display: flex;
        flex-wrap: wrap;
        grid-gap: 12px;
        max-height: 210px;
        overflow-y: auto;
        position: relative;
        padding: 10px 0;
        margin: -10px 0;
    }

    .chains_tag {
        position: relative;
        display: flex;
        align-items: center;
        white-space: nowrap;
        text-align: left;
        background-image: none;
        border: 1px solid transparent;
        box-shadow: 0 2px 0 rgb(0 0 0 / 2%);
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        user-select: none;
        padding: 5px 8px 5px 8px;
        border-radius: 4px;
        color: var(--bj-text-second);
        background: var(--bj-background-color);
        width: 158px;
        box-sizing: border-box;

        &.selected {
            background: #fff;
        }

        &.disabled {
            cursor: not-allowed;
            filter: grayscale(100%);

            &:hover {
                border-color: transparent;
            }
        }

        &:hover {
            border-color: var(--bj-primary-color);
        }
        .symbol {
            overflow: hidden;
            text-overflow: ellipsis;
        }
        &__badge {
            position: absolute;
            top: 0;
            right: 36px;
            transform: translate(50%, -50%);
            border-radius: 16px;
            line-height: 14px;
            color: #fff;
            background-color: var(--bj-primary-color);
            font-size: 10px;
            padding: 1px 8px;
            white-space: nowrap;
            z-index: 1;
        }
    }

    .token_input {
        width: 280px;
    }

    .confirm_button {
        color: #fff;
    }

    .tip {
        width: 20px;

        &__color {
            color: var(--bj-text-second);
            text-align: center;
            margin: -2px -2px;
            word-break: break-word;
            max-width: 230px;
        }
    }

    // tablet
    @media screen and (max-width: 768px) {
        .overlay {
            max-width: 381px;
            max-height: 552px;
            overflow-y: auto;
        }
    }

    // mobile
    @media screen and (max-width: 414px) {
        .overlay {
            max-width: 284px;
        }

        .confirm_button {
            margin: 12px 0 0;
        }

        .token_input {
            width: 245px;
        }
    }
</style>
