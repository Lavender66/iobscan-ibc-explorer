<template>
    <div class="address">
        <span class="address__label">
            <span v-if="chainInfo" class="address__chain_name">{{ chainName }}</span>
            <span>{{ chainAddress.label }}</span>
        </span>
        <span class="address__value">
            <span>{{ chainAddress.value }}</span>
            <CopyComponent
                v-if="chainAddress.value !== DEFAULT_DISPLAY_TEXT"
                :copy-text="chainAddress.value"
            ></CopyComponent>
        </span>
    </div>
</template>

<script setup lang="ts">
    import { useMatchChainInfo } from '@/composables';
    import type { IInfoList, ITxInfo } from '@/types/interface/transfers.interface';
    import { DEFAULT_DISPLAY_TEXT } from '@/constants';
    interface IProps {
        chainAddress: IInfoList;
        chainInfo?: ITxInfo;
    }
    const props = defineProps<IProps>();
    const chainName = computed(() => {
        if (props.chainInfo) {
            const { chainName } = useMatchChainInfo(props.chainInfo.chain_id);
            return chainName || DEFAULT_DISPLAY_TEXT;
        }
    });
</script>

<style lang="less" scoped>
    .address {
        .flex(column, nowrap, flex-start, flex-start);
        &__label {
            font-size: var(--bj-font-size-normal);
            font-family: GolosUI_Medium;
            font-weight: 500;
            color: var(--bj-text-normal);
            line-height: 18px;
        }
        &__value {
            margin-top: 2px;
            font-size: var(--bj-font-size-normal);
            font-weight: 400;
            color: var(--bj-text-second);
            line-height: 18px;
            word-break: break-all;
        }
        &__chain_name {
            margin-right: 4px;
        }
    }
    @media screen and (max-width: 1160px) {
        .address {
            .flex(row, nowrap, flex-start, flex-start);
            &__label {
                width: 140px;
            }
            &__value {
                flex: 1;
                margin-left: 24px;
            }
            &__chain_name {
            }
        }
    }
    @media screen and (max-width: 500px) {
        .address {
            .flex(column, nowrap, flex-start, flex-start);
            &__label {
                width: 100%;
            }
            &__value {
                margin-left: 0;
            }
            &__chain_name {
            }
        }
    }
</style>
