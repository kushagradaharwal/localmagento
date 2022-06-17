define([
    'jquery',
    'mage/utils/wrapper',
    'mage/apply/main'
], function ($, wrapper, mage) {
    'use strict';

    return function(targetModule){

        var displayRegularPriceBlock = targetModule.prototype._displayRegularPriceBlock,
            fillSelect = targetModule.prototype._fillSelect;

        targetModule.prototype._displayRegularPriceBlock = wrapper.wrap(displayRegularPriceBlock, function(original, optionId) {
            var shouldBeShown = true,
                $elm = $(this.options.slyOldPriceSelector).parents('.price-box').find('.normal-price'),
                $product = this.element.parents(this.options.selectorProduct),
                $productPrice = $product.find(this.options.selectorProductPrice),
                product_list_info = this.element.parents('.product-item-info'),
                product_view_info = this.element.parents('.catalog-product-view'),
                discount_elm = product_list_info.find('.discount-percent'),
                discount_view_elm = product_view_info.find('.product.media .discount-percent');

            _.each(this.options.settings, function (element) {
                if (element.value === '') {
                    shouldBeShown = false;
                }
            });

            if (shouldBeShown &&
                this.options.spConfig.optionPrices[optionId].oldPrice.amount !==
                this.options.spConfig.optionPrices[optionId].finalPrice.amount
            ) {
                if ($elm.length) {
                    $elm.addClass('special-price');
                }

                $productPrice.find(this.options.slyOldPriceSelector).show();

                if (product_list_info.length) {
                    if (discount_elm.length) {
                        discount_elm.show();
                        discount_elm.text(discount_text);
                    } else {
                        product_list_info.find('.product-item-photo').append('<span class="discount-percent">'+discount_text+'</span>');
                    }
                }

                if (product_view_info.length) {
                    if (discount_view_elm.length) {
                        discount_view_elm.show();
                        discount_view_elm.text(discount_text);
                    } else {
                        product_view_info.find('.product.media').append('<span class="discount-percent">'+discount_text+'</span>');
                    }
                }
            } else {
                if ($elm.length) {
                    $elm.removeClass('special-price');
                }

                $productPrice.find(this.options.slyOldPriceSelector).hide();

                if (discount_elm.length) {
                    discount_elm.hide();
                }

                if (discount_view_elm.length) {
                    discount_view_elm.hide();
                }
            }

            $(document).trigger('updateMsrpPriceBlock',
                [
                    optionId,
                    this.options.spConfig.optionPrices
                ]
            );
        });

        /**
         * Populates an option's selectable choices.
         * @private
         * @param {*} element - Element associated with a configurable option.
         */
        targetModule.prototype._fillSelect = wrapper.wrap(fillSelect, function (original, element) {
            var attributeId = element.id.replace(/[a-z]*/, ''),
                options = this._getAttributeOptions(attributeId),
                prevConfig,
                index = 1,
                allowedProducts,
                allowedProductsByOption,
                allowedProductsAll,
                i,
                j,
                finalPrice = parseFloat(this.options.spConfig.prices.finalPrice.amount),
                optionFinalPrice,
                optionPriceDiff,
                optionPrices = this.options.spConfig.optionPrices,
                allowedOptions = [],
                indexKey,
                allowedProductMinPrice,
                allowedProductsAllMinPrice;

            this._clearSelect(element);
            element.options[0] = new Option('', '');
            element.options[0].innerHTML = this.options.spConfig.chooseText;
            prevConfig = false;

            if (element.prevSetting) {
                prevConfig = element.prevSetting.options[element.prevSetting.selectedIndex];
            }

            if (options) {
                for (indexKey in this.options.spConfig.index) {
                    /* eslint-disable max-depth */
                    if (this.options.spConfig.index.hasOwnProperty(indexKey)) {
                        allowedOptions = allowedOptions.concat(_.values(this.options.spConfig.index[indexKey]));
                    }
                }

                if (prevConfig) {
                    allowedProductsByOption = {};
                    allowedProductsAll = [];

                    for (i = 0; i < options.length; i++) {
                        /* eslint-disable max-depth */
                        for (j = 0; j < options[i].products.length; j++) {
                            // prevConfig.config can be undefined
                            if (prevConfig.config &&
                                prevConfig.config.allowedProducts &&
                                prevConfig.config.allowedProducts.indexOf(options[i].products[j]) > -1) {
                                if (!allowedProductsByOption[i]) {
                                    allowedProductsByOption[i] = [];
                                }
                                allowedProductsByOption[i].push(options[i].products[j]);
                                allowedProductsAll.push(options[i].products[j]);
                            }
                        }
                    }

                    if (typeof allowedProductsAll[0] !== 'undefined' &&
                        typeof optionPrices[allowedProductsAll[0]] !== 'undefined') {
                        allowedProductsAllMinPrice = this._getAllowedProductWithMinPrice(allowedProductsAll);
                        finalPrice = parseFloat(optionPrices[allowedProductsAllMinPrice].finalPrice.amount);
                    }
                }

                for (i = 0; i < options.length; i++) {
                    if (prevConfig && typeof allowedProductsByOption[i] === 'undefined') {
                        continue; //jscs:ignore disallowKeywords
                    }

                    allowedProducts = prevConfig ? allowedProductsByOption[i] : options[i].products.slice(0);
                    optionPriceDiff = 0;

                    if (typeof allowedProducts[0] !== 'undefined' &&
                        typeof optionPrices[allowedProducts[0]] !== 'undefined') {
                        allowedProductMinPrice = this._getAllowedProductWithMinPrice(allowedProducts);
                        optionFinalPrice = parseFloat(optionPrices[allowedProductMinPrice].finalPrice.amount);
                        optionPriceDiff = optionFinalPrice - finalPrice;
                        options[i].label = options[i].initialLabel;

                        // Remove price on options
                        /*if (optionPriceDiff !== 0) {
                            options[i].label += ' ' + priceUtils.formatPrice(
                                optionPriceDiff,
                                this.options.priceFormat,
                                true
                            );
                        }*/
                    }

                    if (allowedProducts.length > 0 || _.include(allowedOptions, options[i].id)) {
                        options[i].allowedProducts = allowedProducts;
                        element.options[index] = new Option(this._getOptionLabel(options[i]), options[i].id);

                        if (typeof options[i].price !== 'undefined') {
                            element.options[index].setAttribute('price', options[i].price);
                        }

                        if (allowedProducts.length === 0) {
                            element.options[index].disabled = true;
                        }

                        element.options[index].config = options[i];
                        index++;
                    }

                    /* eslint-enable max-depth */
                }
            }
        });

        return targetModule;
    };
});
