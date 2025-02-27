<template>
    <div class="flex items-center token_icon">
        <img
            :src="tokenInfo.imgSrc"
            class="icon cursor mr-8"
            :class="{ small_icon: iconSize === TableCellIconSize.SMALL }"
            @click="go"
        />
        <div
            class="flex flex-col justify-around"
            :style="{ height: iconSize === TableCellIconSize.SMALL ? '32px' : '40px' }"
        >
            <a-popover v-if="titleCanPopover(tokenInfo.title)">
                <template #content>
                    <div class="popover_c">{{ tokenInfo.defaultTitle }}</div>
                </template>
                <div
                    class="title leading_none"
                    :class="{ hover_cursor: titleCanClick }"
                    @click="go"
                    >{{ tokenInfo.title }}</div
                >
            </a-popover>
            <div
                v-else
                class="title leading_none"
                :class="{ hover_cursor: titleCanClick }"
                @click="go"
                >{{ tokenInfo.title }}</div
            >

            <div class="subtitle leading_none tag">{{
                tokenType ? tokenType : tokenInfo.subtitle
            }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { getRestString } from '@/helper/parseStringHelper';
    import { IBaseDenom } from '@/types/interface/index.interface';
    import { computed } from 'vue';
    import {
        TableCellIconSize,
        TTableCellIconSize
    } from '@/types/interface/components/table.interface';

    interface IProps {
        iconSize?: TTableCellIconSize;
        denom: string;
        chainId: string;
        denomsData: IBaseDenom[];
        titleCanClick?: boolean;
        tokenType?: string;
        basePage?: boolean; // 是否是 /tokens 页面
    }

    const props = withDefaults(defineProps<IProps>(), {
        tokenType: '',
        iconSize: TableCellIconSize.NORMAL
    });

    const tokenInfo = computed(() => {
        const filterData = props.denomsData.find(
            (item) => item.denom === props.denom && item.chain_id == props.chainId
        );
        if (filterData) {
            return {
                defaultTitle: filterData.symbol,
                title: props.basePage
                    ? getRestString(filterData.symbol, 6, 0)
                    : getRestString(filterData.symbol, 3, 8),
                subtitle: 'Authed',
                imgSrc: filterData.icon
                    ? filterData.icon
                    : new URL('../../../assets/token-default.png', import.meta.url).href
            };
        } else {
            return {
                defaultTitle: props.denom,
                title: props.basePage
                    ? getRestString(props.denom, 6, 0)
                    : getRestString(props.denom, 3, 8),
                subtitle: 'Other',
                imgSrc: new URL('../../../assets/token-default.png', import.meta.url).href
            };
        }
    });

    const titleCanPopover = (t: string) => (props.basePage ? t.length > 6 : t.length > 11);

    const emit = defineEmits<{
        (e: 'clickTitle'): void;
    }>();

    const go = () => {
        emit('clickTitle');
    };
</script>

<style lang="less" scoped>
    .token_icon {
        &:hover {
            .leading_none {
                color: var(--bj-primary-color);
            }
        }
    }
    .icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }

    .small_icon {
        width: 32px;
        height: 32px;
    }

    .title {
        font-size: var(--bj-font-size-sub-title);
        font-family: GolosUI_Medium;
        color: var(--bj-text-second);
    }

    .subtitle {
        font-family: GolosUI_Medium;
        color: var(--bj-text-third);
    }

    .tag {
        font-size: var(--bj-font-size-small);
        color: var(--bj-primary-color);
        padding: 2px 4px;
        width: 53px;
        border-radius: 8px;
        background: rgba(61, 80, 255, 0.1);
        display: inline-flex;
        justify-content: center;
        align-items: center;
    }
</style>
