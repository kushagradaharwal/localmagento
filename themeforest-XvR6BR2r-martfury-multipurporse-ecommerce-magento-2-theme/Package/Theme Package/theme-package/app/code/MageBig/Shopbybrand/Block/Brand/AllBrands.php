<?php
/**
 * Copyright © 2020 MageBig, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

namespace MageBig\Shopbybrand\Block\Brand;

use Magento\Framework\Registry;
use Magento\Framework\View\Element\Template\Context;
use Magento\Store\Model\ScopeInterface;

class AllBrands extends \Magento\Framework\View\Element\Template implements \Magento\Framework\DataObject\IdentityInterface
{
    protected $_coreRegistry = null;

    protected $_scopeConfig = null;

    public function __construct(
        Context  $context,
        Registry $registry,
        array    $data = []
    )
    {
        $this->_coreRegistry = $registry;
        $this->_scopeConfig = $context->getScopeConfig();
        parent::__construct($context, $data);
    }

    public function getIdentities()
    {
        return ['magebig_all_brands_page'];
    }

    public function getPageInfo()
    {
        $brands = new \Magento\Framework\DataObject([
            'title' => $this->_scopeConfig->getValue('magebig_shopbybrand/our_brands_page/title', ScopeInterface::SCOPE_STORES) ?: __('Our Brands'),
            'description' => $this->_scopeConfig->getValue('magebig_shopbybrand/our_brands_page/description', ScopeInterface::SCOPE_STORES) ?: '',
            'display_featured_brands' => $this->_scopeConfig->getValue('magebig_shopbybrand/our_brands_page/display_featured_brands', ScopeInterface::SCOPE_STORES),
            'display_brand_search' => $this->_scopeConfig->getValue('magebig_shopbybrand/our_brands_page/display_brand_search', ScopeInterface::SCOPE_STORES),
            'meta_title' => $this->_scopeConfig->getValue('magebig_shopbybrand/our_brands_page/meta_title', ScopeInterface::SCOPE_STORES),
            'meta_keywords' => $this->_scopeConfig->getValue('magebig_shopbybrand/our_brands_page/meta_keywords', ScopeInterface::SCOPE_STORES),
            'meta_description' => $this->_scopeConfig->getValue('magebig_shopbybrand/our_brands_page/meta_description', ScopeInterface::SCOPE_STORES),
            'featured_brand_title' => $this->_scopeConfig->getValue('magebig_shopbybrand/featured_brands/title', ScopeInterface::SCOPE_STORES)
        ]);
        return $brands;
    }

}
