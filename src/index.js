import React, { useCallback, useRef } from 'react'
import { WebView } from 'react-native-webview'

import template from './template'

PlayerEvents = [
  'controlschange',
  'fullscreenchange',
  'audioprocess',
  'canplay',
  'canplaythrough',
  'complete',
  'durationchange',
  'emptied',
  'ended',
  'loadeddata',
  'loadedmetadata',
  'pause',
  'play',
  'playing',
  'ratechange',
  'seeked',
  'seeking',
  'stalled',
  'suspend',
  'timeupdate',
  'volumechange',
  'error',
]

export const Vimeo = ({
  handlers: handlersArr,
  videoId,
  videoPrivate,
  videoUrl,
  params,
  autoplay,
  reference,
  allowsPictureInPictureMediaPlayback,
  ...otherProps
}) => {
  const webRef = useRef()
  const url = params ? `https://player.vimeo.com/video/${videoId}?${encodeURIComponent(params)}` : `https://player.vimeo.com/video/${videoId}`

  const webviewAutoPlay = autoplay || params?.includes('autoplay=1')
  const handlers = {}

  const registerHandlers = useCallback(() => {
    PlayerEvents.forEach((name) => {
      if (handlersArr) handlers[name] = handlersArr[name]
    })
  }, [handlers, handlersArr])

  registerHandlers()

  const onBridgeMessage = useCallback(
    (event) => {
      const payload = JSON.parse(event.nativeEvent.data)
      let bridgeMessageHandler = handlers[payload?.name]
      if (bridgeMessageHandler) bridgeMessageHandler(payload?.data)
    },
    [handlers]
  )

  return (
    <WebView
      allowsFullscreenVideo={true}
      originWhitelist={['*']}
      source={{
        'uri': videoUrl ? videoUrl : url,
        'headers': { Referer: reference }
      }}
      javaScriptEnabled={true}
      ref={webRef}
      onMessage={onBridgeMessage}
      scrollEnabled={false}
      injectedJavaScript={template(videoId, Boolean(videoPrivate), url)}
      mediaPlaybackRequiresUserAction={!webviewAutoPlay}
      allowsPictureInPictureMediaPlayback={typeof allowsPictureInPictureMediaPlayback === 'boolean' ? allowsPictureInPictureMediaPlayback : true}
      {...otherProps}
    />
  )
}
